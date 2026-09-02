import type { TypeFromArrayConst } from "@/utils/types"

/**
 * @see /api/src/State/UploadFileProcessor.php#L35
 */
export const allowedMimeType = [
	"application/pdf",
	"application/json",
	"image/jpeg",
	"image/png",
	"image/webp",
	"text/plain",
	"audio/mpeg",
	"audio/mp4",
	"audio/ogg",
	"audio/wav",
	"audio/x-wav",
	"video/mp4",
	"video/ogg",
	"video/webm",
] as const

export type AllowedMimeType = TypeFromArrayConst<typeof allowedMimeType>
