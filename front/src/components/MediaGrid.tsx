import type { ComponentPropsWithRef } from "react"

import type { PreviewProps } from "@/layouts/Dialogs"
import { cn } from "@/utils/cn"
import { openPreview } from "@/utils/dialogs"

import { MediaGridItem, type MediaGridItemProps } from "./MediaGridItem"
import { defaultItemsPerPage } from "@/utils/pagination"

export type MediaGridContainerProps = ComponentPropsWithRef<"div">

export const MediaGridContainer = ({ ref, children, className, ...props }: MediaGridContainerProps) => (
	<div
		ref={ref}
		className={cn(
			"grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-1 is-horizontal:gap-1.5",
			className
		)}
		{...props}
	>
		{children}
	</div>
)

export type MediaGridProps = ComponentPropsWithRef<"div"> & {
	items?: MediaGridItemProps[]
	onItem?: PreviewProps["onItem"]
}

export const MediaGrid = ({ items = [], onItem, ...props }: MediaGridProps) => {
	return (
		<MediaGridContainer {...props}>
			{items.map((item, index) => (
				<button
					key={item.id}
					onClick={() => openPreview(index, { onItem })}
					aria-label="Visualiser le document"
					className={cn(
						"cursor-pointer w-full aspect-square rounded-sm sm:rounded-md",
						"outline-2 sm:outline-offset-2 outline-transparent focus-visible:outline-primary",
						"translate-0 starting:opacity-0 starting:translate-y-4",
						"transition duration-500"
					)}
					style={{
						transitionDelay: `${15 * (index % defaultItemsPerPage)}ms`,
					}}
				>
					<MediaGridItem {...item} />
				</button>
			))}
		</MediaGridContainer>
	)
}
