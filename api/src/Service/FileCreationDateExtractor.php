<?php

namespace App\Service;

final class FileCreationDateExtractor
{
    private const array DATE_CANDIDATES = [
        ['EXIF', 'DateTimeOriginal', 'OffsetTimeOriginal'],
        ['EXIF', 'DateTimeDigitized', 'OffsetTimeDigitized'],
        ['IFD0', 'DateTime', 'OffsetTime'],
    ];

    public function extract(
        string $path,
        string $mimeType,
        \DateTimeImmutable $uploadedAt,
    ): ?\DateTimeImmutable {
        if ('image/jpeg' !== $mimeType || !function_exists('exif_read_data')) {
            return null;
        }

        $metadata = @exif_read_data($path, null, true, false);
        if (!is_array($metadata)) {
            return null;
        }

        foreach (self::DATE_CANDIDATES as [$section, $dateKey, $offsetKey]) {
            $value = $metadata[$section][$dateKey] ?? null;
            if (!is_string($value)) {
                continue;
            }

            $offset = $metadata[$section][$offsetKey] ?? $metadata['EXIF'][$offsetKey] ?? null;
            $date = $this->parse($value, is_string($offset) ? $offset : null, $uploadedAt->getTimezone());

            if (null !== $date && $this->isPlausible($date, $uploadedAt)) {
                return $date->setTimezone(new \DateTimeZone('UTC'));
            }
        }

        return null;
    }

    private function parse(
        string $value,
        ?string $offset,
        \DateTimeZone $fallbackTimezone,
    ): ?\DateTimeImmutable {
        $offset = null !== $offset && 1 === preg_match('/^[+-]\d{2}:\d{2}$/', $offset) ? $offset : null;
        $format = null === $offset ? '!Y:m:d H:i:s' : '!Y:m:d H:i:sP';
        $date = \DateTimeImmutable::createFromFormat(
            $format,
            trim($value).($offset ?? ''),
            null === $offset ? $fallbackTimezone : null,
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
