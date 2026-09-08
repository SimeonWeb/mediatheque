import type { Batch, BatchItem } from "@rpldy/uploady"

import { getExtensionFromMime, getTypeFromMime } from "@/features/mediaFile/utils/helpers"
import type { MediaGridItemProps } from "@/components/MediaGridItem"

export const toMediaGridItem = ({ id, file }: BatchItem): MediaGridItemProps => ({
	id,
	name: file.name,
	// @ts-expect-error incompatble types but it's ok...
	src: URL.createObjectURL(file),
	extension: getExtensionFromMime(file.type),
	type: getTypeFromMime(file.type),
})

export const defaultBatchItemCount = {
	image: 0,
	video: 0,
	audio: 0,
	document: 0,
	other: 0,
}

export const getBatchItemCount = ({ items }: Pick<Batch, "items">) => (
	items.reduce(
		(prev, current) => {
			const type = getTypeFromMime(current.file.type)

			switch (type) {
				case "image":
					prev.image++
					break
				case "video":
					prev.video++
					break
				case "audio":
					prev.audio++
					break
				case "application":
					prev.document++
					break
				default:
					prev.other++
					break
			}

			return prev
		},
		{ ...defaultBatchItemCount }
	)
)
