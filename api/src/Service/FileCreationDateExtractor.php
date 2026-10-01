<?php

namespace App\Service;

use Symfony\Component\DependencyInjection\Attribute\Autowire;

final class FileCreationDateExtractor
{
    private const array QUICKTIME_MIME_TYPES = [
        'video/mp4',
        'video/quicktime',
    ];

    private const array DATE_CANDIDATES = [
        ['EXIF', 'DateTimeOriginal', 'OffsetTimeOriginal', 'UndefinedTag:0x9011'],
        ['EXIF', 'DateTimeDigitized', 'OffsetTimeDigitized', 'UndefinedTag:0x9012'],
        ['IFD0', 'DateTime', 'OffsetTime', 'UndefinedTag:0x9010'],
    ];

    private readonly \DateTimeZone $defaultTimezone;

    public function __construct(#[Autowire('%env(APP_TIMEZONE)%')] string $defaultTimezone)
    {
        $this->defaultTimezone = new \DateTimeZone($defaultTimezone);
    }

    public function extract(
        string $path,
        string $mimeType,
        \DateTimeImmutable $uploadedAt,
    ): ?\DateTimeImmutable {
        if ('image/jpeg' === $mimeType) {
            return $this->extractImageDate($path, $uploadedAt);
        }

        if (in_array($mimeType, self::QUICKTIME_MIME_TYPES, true)) {
            return $this->extractQuickTimeDate($path, $uploadedAt);
        }

        return null;
    }

    private function extractImageDate(string $path, \DateTimeImmutable $uploadedAt): ?\DateTimeImmutable
    {
        if (!function_exists('exif_read_data')) {
            return null;
        }

        $metadata = @exif_read_data($path, null, true, false);
        if (!is_array($metadata)) {
            return null;
        }

        foreach (self::DATE_CANDIDATES as [$section, $dateKey, $offsetKey, $rawOffsetKey]) {
            $value = $metadata[$section][$dateKey] ?? null;
            if (!is_string($value)) {
                continue;
            }

            $offset = $metadata[$section][$offsetKey]
                ?? $metadata['EXIF'][$offsetKey]
                ?? $metadata['EXIF'][$rawOffsetKey]
                ?? null;
            $date = $this->parse($value, is_string($offset) ? $offset : null);

            if (null !== $date && $this->isPlausible($date, $uploadedAt)) {
                return $date->setTimezone(new \DateTimeZone('UTC'));
            }
        }

        return null;
    }

    private function extractQuickTimeDate(string $path, \DateTimeImmutable $uploadedAt): ?\DateTimeImmutable
    {
        try {
            $metadata = (new \getID3())->analyze($path);
        } catch (\Throwable) {
            return null;
        }

        if (!is_array($metadata) || isset($metadata['error'])) {
            return null;
        }

        $creationDates = [
            ...$this->getStringValues($metadata, ['quicktime', 'comments', 'creationdate']),
            ...$this->getStringValues($metadata, ['quicktime', 'comments', 'creation_date']),
        ];

        foreach ([true, false] as $mustContainTimezone) {
            foreach ($creationDates as $value) {
                if ($this->containsTimezone($value) !== $mustContainTimezone) {
                    continue;
                }

                $date = $this->parseQuickTimeDate($value);
                if (null !== $date && $this->isPlausible($date, $uploadedAt)) {
                    return $date->setTimezone(new \DateTimeZone('UTC'));
                }
            }
        }

        $movieCreationTimestamp = $metadata['quicktime']['timestamps_unix']['create']['moov mvhd'] ?? null;
        if (!is_int($movieCreationTimestamp) && !is_float($movieCreationTimestamp)) {
            return null;
        }

        try {
            $date = new \DateTimeImmutable('@'.(string) (int) $movieCreationTimestamp);
        } catch (\Throwable) {
            return null;
        }

        return $this->isPlausible($date, $uploadedAt) ? $date : null;
    }

    /**
     * @param array<string, mixed> $metadata
     * @param list<string>         $path
     *
     * @return list<string>
     */
    private function getStringValues(array $metadata, array $path): array
    {
        $values = $metadata;
        foreach ($path as $key) {
            if (!is_array($values) || !array_key_exists($key, $values)) {
                return [];
            }

            $values = $values[$key];
        }

        if (is_string($values)) {
            return [$values];
        }

        if (!is_array($values)) {
            return [];
        }

        return array_values(array_filter($values, is_string(...)));
    }

    private function containsTimezone(string $value): bool
    {
        return 1 === preg_match('/(?:Z|[+-]\d{2}:?\d{2})$/i', trim($value));
    }

    private function parseQuickTimeDate(string $value): ?\DateTimeImmutable
    {
        $value = trim($value, "\0 \t\n\r\x0B");
        if (1 !== preg_match('/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/i', $value)) {
            return null;
        }

        try {
            return new \DateTimeImmutable($value, $this->defaultTimezone);
        } catch (\Throwable) {
            return null;
        }
    }

    private function parse(
        string $value,
        ?string $offset,
    ): ?\DateTimeImmutable {
        $offset = null !== $offset && 1 === preg_match('/^[+-]\d{2}:\d{2}$/', $offset) ? $offset : null;
        $format = null === $offset ? '!Y:m:d H:i:s' : '!Y:m:d H:i:sP';
        $date = \DateTimeImmutable::createFromFormat(
            $format,
            trim($value).($offset ?? ''),
            null === $offset ? $this->defaultTimezone : null,
        );
        $errors = \DateTimeImmutable::getLastErrors();

        if (false === $date || (is_array($errors) && (0 !== $errors['warning_count'] || 0 !== $errors['error_count']))) {
            return null;
        }

        return $date;
    }

    private function isPlausible(\DateTimeImmutable $date, \DateTimeImmutable $uploadedAt): bool
    {
        return $date >= new \DateTimeImmutable('1970-01-01T00:00:00+00:00')
            && $date <= $uploadedAt->modify('+1 day');
    }
}
