import type { ComponentPropsWithRef } from "react"

import type { MediaFile } from "@/features/mediaFile/api/types"
import { cn } from "@/utils/cn"
import { openPreview } from "@/utils/dialogs"

import { MediaGridImage, MediaGridItem } from "./MediaGridItem"
import type { PreviewProps } from "@/layouts/Dialogs"

export type MediaGridProps = ComponentPropsWithRef<"div"> & {
	items?: MediaFile[]
	onItem?: PreviewProps["onItem"]
}

export const MediaGrid = ({ ref, items = [], onItem }: MediaGridProps) => {
	console.log("MediaGrid items", items.length)
	return (
		<div
			ref={ref}
			className={cn(
				"grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-1 is-horizontal:gap-1.5",
				"p-1 is-horizontal:p-[2.5vw] is-horizontal:pl-0"
			)}
		>
			{items.map((item, index) => (
				<button
					key={item.id}
					onClick={() => openPreview(index, { onItem })}
					aria-label="Visualiser le document"
					className="cursor-pointer"
				>
					{item.mimeType.startsWith("image/")
						? <MediaGridImage {...item} index={index} />
						: <MediaGridItem {...item} index={index} />
					}
				</button>
			))}
		</div>
	)
}
