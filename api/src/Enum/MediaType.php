<?php

namespace App\Enum;

enum MediaType: string
{
    case Image = 'image';
    case Video = 'video';
    case Audio = 'audio';
    case Document = 'document';
    case Other = 'other';

    public const array VALUES = [
        self::Image->value,
        self::Video->value,
        self::Audio->value,
        self::Document->value,
        self::Other->value,
    ];

    public static function fromMimeType(string $mimeType): self
    {
        return match (true) {
            str_starts_with($mimeType, 'image/') => self::Image,
            str_starts_with($mimeType, 'video/') => self::Video,
            str_starts_with($mimeType, 'audio/') => self::Audio,
            str_starts_with($mimeType, 'text/'),
            in_array($mimeType, ['application/pdf', 'application/json'], true) => self::Document,
            default => self::Other,
        };
    }
}
