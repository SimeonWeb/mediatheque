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
}
