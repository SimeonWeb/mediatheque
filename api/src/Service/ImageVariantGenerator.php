<?php

namespace App\Service;

final class ImageVariantGenerator
{
    private const int MAX_SOURCE_PIXELS = 40_000_000;

    public function generate(string $sourcePath, string $targetPath, int $size): void
    {
        $imageInfo = @getimagesize($sourcePath);
        if (false === $imageInfo) {
            throw new \RuntimeException('Le fichier image est illisible.');
        }

        [$sourceWidth, $sourceHeight] = $imageInfo;
        if ($sourceWidth < 1 || $sourceHeight < 1 || $sourceWidth * $sourceHeight > self::MAX_SOURCE_PIXELS) {
            throw new \RuntimeException('Les dimensions de l’image sont invalides.');
        }

        $contents = @file_get_contents($sourcePath);
        $source = false === $contents ? false : @imagecreatefromstring($contents);
        if (false === $source) {
            throw new \RuntimeException('Le format de l’image ne peut pas être traité.');
        }

        $source = $this->applyExifOrientation($source, $sourcePath, $imageInfo[2]);
        $sourceWidth = imagesx($source);
        $sourceHeight = imagesy($source);

        $maxSize = max(1, $size);
        $ratio = min($maxSize / $sourceWidth, $maxSize / $sourceHeight, 1);
        $targetWidth = max(1, (int) round($sourceWidth * $ratio));
        $targetHeight = max(1, (int) round($sourceHeight * $ratio));
        $variant = imagecreatetruecolor($targetWidth, $targetHeight);

        if (false === $variant) {
            imagedestroy($source);
            throw new \RuntimeException('La variante de l’image n’a pas pu être initialisée.');
        }

        $background = imagecolorallocate($variant, 255, 255, 255);
        imagefill($variant, 0, 0, $background);

        $resampled = imagecopyresampled(
            $variant,
            $source,
            0,
            0,
            0,
            0,
            $targetWidth,
            $targetHeight,
            $sourceWidth,
            $sourceHeight,
        );
        $written = $resampled && imagejpeg($variant, $targetPath, 85);

        imagedestroy($variant);
        imagedestroy($source);

        if (!$written) {
            @unlink($targetPath);
            throw new \RuntimeException('La variante de l’image n’a pas pu être écrite.');
        }
    }

    private function applyExifOrientation(\GdImage $source, string $sourcePath, int $imageType): \GdImage
    {
        if (IMAGETYPE_JPEG !== $imageType || !function_exists('exif_read_data')) {
            return $source;
        }

        $metadata = @exif_read_data($sourcePath, 'IFD0', true, false);
        $orientation = is_array($metadata) ? (int) ($metadata['IFD0']['Orientation'] ?? 1) : 1;

        if (in_array($orientation, [2, 4, 5, 7], true)) {
            $flipMode = in_array($orientation, [2, 5], true) ? IMG_FLIP_HORIZONTAL : IMG_FLIP_VERTICAL;
            if (!imageflip($source, $flipMode)) {
                imagedestroy($source);
                throw new \RuntimeException('L’orientation de l’image n’a pas pu être appliquée.');
            }
        }

        $angle = match ($orientation) {
            3, 4 => 180,
            5, 8 => 90,
            6, 7 => -90,
            default => 0,
        };

        if (0 === $angle) {
            return $source;
        }

        $oriented = imagerotate($source, $angle, 0);
        imagedestroy($source);

        if (false === $oriented) {
            throw new \RuntimeException('L’orientation de l’image n’a pas pu être appliquée.');
        }

        return $oriented;
    }
}
