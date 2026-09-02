import { cn } from "@/utils/cn"

import { Icon } from "./Icon"

export type MediaGridItemProps = {
	id: string
	name: string
	src: string
	extension?: string
	type: string
}

export const MediaGridItem = (item: MediaGridItemProps) => {
	switch (item.type) {
		case "image":
			return <MediaGridImage {...item} />
		case "video":
			return <MediaGridVideo {...item} />
		default:
			return <MediaGridDocument {...item} />
	}
}

export const MediaGridDocument = ({ name, extension }: MediaGridItemProps) => {
	return (
		<div
			className={cn(
				"@container-size",
				"w-full aspect-square rounded-sm sm:rounded-md",
				"flex flex-col items-center justify-center gap-[1.5cqb] p-[1.5cqb]",
				"text-center uppercase text-2xs sm:text-xs leading-tight",
				"text-primary bg-primary/20",
			)}
		>
			<div className="size-[40cqb] grid col-span-1 row-span-1 justify-center items-center">
				<Icon name="document" className="col-start-1 row-start-1 size-full" />
				<span className="col-start-1 row-start-1 text-white/80 text-[10cqb] pt-[10cqb]">{extension}</span>
			</div>
			<span>{name}</span>
		</div>
	)
}

export const MediaGridImage = ({ name, src }: MediaGridItemProps) => {
	return (
		<img
			src={src}
			className={cn(
				"w-full aspect-square object-cover rounded-sm sm:rounded-md",
				"bg-neutral-200",
			)}
			alt={name}
			loading="lazy"
		/>
	)
}

export const MediaGridVideo = ({ name, src }: MediaGridItemProps) => {
	return (
		<div className="relative">
			<video
				src={src}
				className={cn(
					"w-full aspect-square object-cover rounded-sm sm:rounded-md",
					"bg-neutral-200",
				)}
			>
				{name}
			</video>
			<div className="absolute left-0 bottom-0 size-8 flex justify-center items-center">
				<Icon name="video" className="text-white drop-shadow-md drop-shadow-black" />
			</div>
		</div>
	)
}
