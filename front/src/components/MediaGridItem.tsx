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
		case "audio":
			if (item.extension === "json") {
				return <MediaGridPlaylist {...item} />
			}
			return <MediaGridDocument {...item} />
		default:
			return <MediaGridDocument {...item} />
	}
}

export const MediaGridDocument = ({ name, extension, type }: MediaGridItemProps) => {
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
				{type === "audio"
					? <Icon name="audio" className="col-start-1 row-start-1 size-full" />
					: (
						<>
							<Icon name="document" className="col-start-1 row-start-1 size-full" />
							<span className="col-start-1 row-start-1 text-white/80 text-[10cqb] pt-[10cqb]">{extension}</span>
						</>
					)
				}
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

export const MediaGridPlaylist = ({ name, src }: MediaGridItemProps) => {
	return (
		<div
			className={cn(
				"@container-size",
				"w-full aspect-square rounded-sm sm:rounded-md",
				"grid row-span-1 col-span-1",
				"bg-neutral-200",
			)}
		>
			<img
				src={src}
				className={cn(
					"w-full aspect-square object-cover rounded-sm sm:rounded-md",
					"col-start-1 row-start-1",
				)}
				alt={name}
				loading="lazy"
			/>
			<div
				className={cn(
					"col-start-1 row-start-1 flex flex-col justify-end items-start px-[11cqb] py-[8cqb]",
					"bg-primary/80 font-bold text-accent text-[14cqb] leading-tight",
					"rounded-sm sm:rounded-md"
				)}
			>
				<p className="text-[7cqb] uppercase font-normal text-white">Playlist</p>
				<p>{name}</p>
			</div>
		</div>
	)
}
