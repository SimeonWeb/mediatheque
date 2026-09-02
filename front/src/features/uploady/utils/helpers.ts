import type { Batch, BatchItem } from "@rpldy/uploady"

import type { MediaGridItemProps } from "@/components/MediaGridItem"
import { getTypeFromMime } from "@/features/mediaFile/utils/helpers"

export const toMediaGridItem = ({ id, file }: BatchItem): MediaGridItemProps => ({
	id,
	name: file.name,
	// @ts-expect-error incompatble types but it's ok...
	src: URL.createObjectURL(file),
	extension: "",
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
				default:
					prev.other++
					break
			}

			return prev
		},
		{ ...defaultBatchItemCount }
	)
)
