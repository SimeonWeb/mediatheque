import type { Uploader } from "@/features/uploader/api/types"

export type MediaFilePaths = {
	full: string
	medium: string
	thumbnail: string
}

export type MediaFile = {
	id: string
	originalName: string
	mimeType: string
	extension: string
	size: number
	createdAt: string
	uploadedAt: string
	uploader: Uploader
	paths: MediaFilePaths
}
