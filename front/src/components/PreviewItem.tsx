import { type CSSProperties, type PropsWithChildren, type PropsWithClassName, useRef, useState } from "react"
import { DialogTitle } from "@headlessui/react"
import { useQuery } from "@tanstack/react-query"

import { getStreamingServiceLabel, getStreamingServiceUrl, streamingService, streamingServiceVariants } from "@/features/audioPlaylist/utils/labels"
import type { MediaFile } from "@/features/mediaFile/api/types"
import { audioPlaylistQueryOptions } from "@/features/audioPlaylist/api/option"
import { cn } from "@/utils/cn"
import { displayDateTime } from "@/utils/date"
import { getColumns } from "@/features/audioPlaylist/utils/columns"
import { getFileUrl } from "@/utils/file"
import { isPlaylist } from "@/features/mediaFile/utils/helpers"

import { Button, ExternalLinkButton } from "./Button"
import { Datagrid, WithDatagrid } from "./Datagrid"
import { Badge } from "./Badge"
import { Group } from "./Group"
import { Heading } from "./Heading"
import { Icon } from "./Icon"
import { WithIcon } from "./WithIcon"
import { WithLoading } from "./WithLoading"

export type NavigationEvents = {
	onPrevious?: () => void
	onNext?: () => void
}

export type PreviewItemProps = {
	item: MediaFile
	style?: CSSProperties
	navigationEvents?: NavigationEvents
}

export const PreviewItem = (props: PreviewItemProps) => {
	switch (props.item.type) {
		case "image":
			return <PreviewImage {...props} />
		case "video":
			return <PreviewVideo {...props} />
		case "audio":
			if (isPlaylist(props.item)) {
				return <PreviewPlaylist {...props} />
			}
			return <PreviewAudio {...props} />
		default:
			return <PreviewDocument {...props} />
	}
}

export type WithPreviewItemNavigationProps = PropsWithChildren<PropsWithClassName<NavigationEvents>>

export const WithPreviewItemNavigation = ({ onPrevious, onNext, children, className }: WithPreviewItemNavigationProps) => (
	<>
		{children}
		{!!onPrevious && (
			<button
				onClick={onPrevious}
				className={cn(
					"group",
					"flex items-center justify-start",
					"fixed top-0 left-0 bottom-0 w-9.5 md:w-1/3 z-50",
					"md:px-6",
					"cursor-left",
					"outline-0",
					"pointer-events-auto",
					className
				)}
			>
				<WithIcon
					before="chevron-left"
					containerClassName={cn(
						"is-horizontal:sr-only group-focus-visible:not-sr-only",
						"size-9.5! rounded-full outline-offset-2",
						"group-focus-visible:bg-neutral-100 group-focus-visible:text-neutral-900",
						"group-focus-visible:outline-2 group-focus-visible:outline-white/50",
						"grow-0 text-white text-shadow-2xl",
						"transition"
					)}
					className="sr-only"
				>
					Précédent
				</WithIcon>
			</button>
		)}
		{!!onNext && (
			<button
				onClick={onNext}
				className={cn(
					"group",
					"flex items-center justify-end",
					"fixed top-0 right-0 bottom-0 w-9.5 md:w-1/3 z-50",
					"md:px-6",
					"cursor-right",
					"outline-0",
					"pointer-events-auto",
					className
				)}
			>
				<WithIcon
					before="chevron-right"
					containerClassName={cn(
						"is-horizontal:sr-only group-focus-visible:not-sr-only",
						"size-9.5! rounded-full outline-offset-2",
						"group-focus-visible:bg-neutral-100 group-focus-visible:text-neutral-900",
						"group-focus-visible:outline-2 group-focus-visible:outline-white/50",
						"grow-0 text-white text-shadow-2xl",
						"transition"
					)}
					className="sr-only"
				>
					Suivant
				</WithIcon>
			</button>
		)}
	</>
)

export const PreviewItemLegend = ({ children }: PropsWithChildren) => (
	<div
		className={cn(
			"flex justify-center",
			"justify-self-center self-end py-[2.5vw] w-full row-start-1 col-start-1",
			"is-horizontal:not-hover:opacity-0 is-horizontal:not-hover:translate-y-2",
			"cursor-help",
			"transition",
		)}
	>
		<Badge intent="dark">{children}</Badge>
	</div>
)

export const PreviewDocument = ({ item: { extension, originalName, uploader, createdAt }, style, navigationEvents }: PreviewItemProps) => (
	<WithPreviewItemNavigation {...navigationEvents}>
		<DialogTitle as={Group} size="xl" className="pointer-events-auto grid w-full h-full" style={style}>
			<div className="flex flex-col gap-4 items-center justify-center text-primary text-center row-start-1 col-start-1">
				<div className="size-20 grid col-span-1 row-span-1 justify-center items-center">
					<Icon name="document" className="col-start-1 row-start-1 size-full" />
					<span className="col-start-1 row-start-1 text-white/80 text-base pt-5 uppercase">{extension}</span>
				</div>
				<Badge>{originalName}</Badge>
			</div>
			<PreviewItemLegend>{uploader.name} • {displayDateTime(createdAt)}</PreviewItemLegend>
		</DialogTitle>
	</WithPreviewItemNavigation>
)

export const PreviewImage = ({ item: { paths, originalName, uploader, createdAt }, style, navigationEvents }: PreviewItemProps) => (
	<WithPreviewItemNavigation {...navigationEvents}>
		<DialogTitle as={Group} size="xl" className="pointer-events-auto grid w-full h-full z-20" style={style}>
			<img
				src={getFileUrl(paths.medium)}
				srcSet={`${getFileUrl(paths.medium)} 1080w, ${getFileUrl(paths.full)} 1920w`}
				alt={originalName}
				className="w-full h-full row-start-1 col-start-1 overflow-hidden object-contain"
			/>
			<PreviewItemLegend>{uploader.name} • {displayDateTime(createdAt)}</PreviewItemLegend>
		</DialogTitle>
	</WithPreviewItemNavigation>
)

export const PreviewVideo = ({ item: { paths, originalName, uploader, createdAt }, style, navigationEvents }: PreviewItemProps) => (
	<WithPreviewItemNavigation {...navigationEvents}>
		<DialogTitle as={Group} size="xl" className="pointer-events-auto grid w-full h-full" style={style}>
			<video
				src={getFileUrl(paths.full)}
				className="w-full aspect-video self-center row-start-1 col-start-1 overflow-hidden object-contain"
				controls
			>
				{originalName}
			</video>
			<PreviewItemLegend>{uploader.name} • {displayDateTime(createdAt)}</PreviewItemLegend>
		</DialogTitle>
	</WithPreviewItemNavigation>
)

export const PreviewAudio = ({ item: { paths, originalName, uploader, createdAt, id }, style, navigationEvents }: PreviewItemProps) => {
	const audioRef = useRef<HTMLAudioElement>(null)

	const [isLoading, setIsLoading] = useState(true)
	const [isPlaying, setIsPlaying] = useState(false)

	const handlePlayPause = () => {
		const audio = audioRef.current

		if (!audio) {
			return
		}

		if (audio.paused) {
			audio.play()
		} else {
			audio.pause()
		}

		setIsPlaying(!audio.paused)
	}

	return (
		<WithPreviewItemNavigation {...navigationEvents}>
			<DialogTitle as={Group} size="xl" className="pointer-events-auto grid w-full h-full" style={style}>
				<div
					className="flex flex-col gap-4 items-center justify-center text-primary text-center row-start-1 col-start-1 text-4xl"
				>
					<audio
						ref={audioRef}
						id={id}
						src={getFileUrl(paths.full)}
						className="max-w-full max-h-full object-contain rounded"
						onCanPlayThrough={() => setIsLoading(false)}
					>
						{originalName}
					</audio>
					<Button
						onClick={handlePlayPause}
						aria-controls={id}
						intent="text"
						size="inherit"
					>
						<WithLoading isLoading={isLoading}>
							{isPlaying
								? (
									<WithIcon before="pause" className="sr-only">
										Pause
									</WithIcon>
								)
								: (
									<WithIcon before="play" className="sr-only">
										Lecture
									</WithIcon>
								)
							}
						</WithLoading>
					</Button>
					<Badge intent="primary">{originalName}</Badge>
				</div>
				<PreviewItemLegend>{uploader.name} • {displayDateTime(createdAt)}</PreviewItemLegend>
			</DialogTitle>
		</WithPreviewItemNavigation>
	)
}

export const PreviewPlaylist = ({ item: { paths, originalName, meta }, style, navigationEvents }: PreviewItemProps) => {
	const { data, isLoading } = useQuery(audioPlaylistQueryOptions(paths.full))

	const playlistPath = paths.thumbnail.replace("artwork.jpg", "")

	return (
		<div className="relative h-full w-full overflow-y-auto pointer-events-auto">
			<WithPreviewItemNavigation {...navigationEvents} className="md:w-9.5">
				<div
					className={cn(
						"container flex flex-col justify-start gap-8 grow p-10 mx-auto",
						"text-white"
					)}
					style={style}
				>
					<header>
						<DialogTitle as={Group} size="xl" className="items-end">
							<img
								src={getFileUrl(paths.thumbnail)}
								className="block size-24 md:size-32 rounded"
							/>
							<Group className="flex-col" size="sm">
								<p className="text-2xs uppercase font-normal text-white">Playlist</p>
								<Heading as="h2" className="text-3xl md:text-4xl text-accent">
									{originalName}
								</Heading>
							</Group>
						</DialogTitle>
					</header>
					<Group
						size="px"
						className="sticky top-2 empty:hidden -mx-2 md:w-auto flex justify-evenly bg-neutral-950/50 rounded sm:rounded-lg backdrop-blur-lg z-45"
					>
						{streamingService.map(service => {
							const url = getStreamingServiceUrl(service, meta)

							return !!url && (
								<ExternalLinkButton
									key={service}
									href={url}
									intent="text"
									rounded={false}
									className={streamingServiceVariants({ service })}
								>
									<WithIcon
										before={service}
										containerClassName="text-xl"
										className="uppercase text-2xs max-sm:sr-only"
									>
										{getStreamingServiceLabel(service)}
									</WithIcon>
								</ExternalLinkButton>
							)
						})}
					</Group>
					<WithDatagrid
						data={data?.items || []}
						columns={getColumns({ playlistPath })}
						isLoading={isLoading}
						rowCount={data?.items.length || 10}
					>
						{table => (
							<Datagrid {...table} />
						)}
					</WithDatagrid>
				</div>
			</WithPreviewItemNavigation>
		</div>
	)

}
