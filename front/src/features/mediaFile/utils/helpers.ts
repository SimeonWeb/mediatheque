import type { MediaFile } from "@/features/mediaFile/api/types"
import type { MediaGridItemProps } from "@/components/MediaGridItem"
import { getFileUrl } from "@/utils/file"

export const toMediaGridItem = ({ id, originalName, paths, extension, mimeType }: MediaFile): MediaGridItemProps => ({
	id,
	name: originalName,
	src: getFileUrl(paths.thumbnail || paths.full),
	extension: extension,
	type: getTypeFromMime(mimeType),
})

export const getTypeFromMime = (mimeType: string) => (
	mimeType.replace(/\/.+$/g, "")
)
