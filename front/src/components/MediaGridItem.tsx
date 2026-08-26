import type { MediaFile } from "@/features/mediaFile/api/types"

import { Icon } from "./Icon"
import { cn } from "@/utils/cn"
import { defaultItemsPerPage } from "@/utils/pagination"
import { getFileUrl } from "@/utils/file"

export type MediaGridItemProps = MediaFile & {
	index: number
}

export const MediaGridItem = ({ originalName, extension, index }: MediaGridItemProps) => {
	return (
		<div
			className={cn(
				"@container-size",
				"w-full aspect-square rounded-sm sm:rounded-md",
				"flex flex-col items-center justify-center gap-[1.5cqb] p-[1.5cqb]",
				"text-center uppercase text-2xs sm:text-xs leading-tight",
				"text-primary bg-primary/20",
				"starting:opacity-0 starting:translate-y-4",
				"transition duration-500"
			)}
			style={{
				transitionDelay: `${10 * (index % defaultItemsPerPage)}ms`,
			}}
		>
			<div className="size-[40cqb] grid col-span-1 row-span-1 justify-center items-center">
				<Icon name="document" className="col-start-1 row-start-1 size-full" />
				<span className="col-start-1 row-start-1 text-white/80 text-[10cqb] pt-[10cqb]">{extension}</span>
			</div>
			<span>{originalName}</span>
		</div>
	)
}

export const MediaGridImage = ({ originalName, paths, index }: MediaGridItemProps) => {
	return (
		<img
			src={getFileUrl(paths.thumbnail)}
			className={cn(
				"w-full aspect-square object-cover rounded-sm sm:rounded-md",
				"starting:opacity-0 starting:translate-y-4",
				"transition duration-500"
			)}
			style={{
				transitionDelay: `${10 * (index % defaultItemsPerPage)}ms`,
			}}
			alt={originalName}
			loading="lazy"
		/>
	)
}
