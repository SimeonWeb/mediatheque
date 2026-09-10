import type { Uploader } from "@/features/uploader/api/types"

export type MediaFilePaths = {
	full: string
	medium: string | null
	thumbnail: string | null
}

export type MediaFile = {
	id: number
	originalName: string
	mimeType: string
	extension: string
	size: number
	createdAt: string
	uploadedAt: string
	uploader: Uploader
	paths: MediaFilePaths
	type: string
	meta: Record<string, string>
}
