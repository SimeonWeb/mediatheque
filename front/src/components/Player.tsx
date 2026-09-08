import * as Controls from "@react-av/controls"
import * as Media from "@react-av/core"
import * as Slider from "@radix-ui/react-slider"
import { type ComponentPropsWithRef, type PropsWithClassName, type ReactNode, useEffect } from "react"
import { ProgressBarRoot } from "@react-av/sliders"

import { isIos, isSafari } from "@/utils/browser"
import type { UserState } from "@/stores/user"
import { cn } from "@/utils/cn"

import { Button } from "./Button"
import { Group } from "./Group"
import { Waveform } from "./Waveform"
import { WithIcon } from "./WithIcon"
import { WithLoading } from "./WithLoading"

type PlayerProps = {
	src: string
}

type PlayPauseButtonProps = Omit<ComponentPropsWithRef<typeof Button>, "onPlay" | "onPause"> & Partial<Pick<UserState, "initPlayer">> & {
	autoPlay?: boolean
	onPlay?: () => void
	onPause?: () => void
}

const PlayPauseButton = ({ className, autoPlay, initPlayer, onPlay, onPause, ...props }: PlayPauseButtonProps) => {
	const [isPlaying, setIsPlaying] = Media.useMediaPlaying()
	const isEnded = Media.useMediaEnded()
	const readyState = Media.useMediaReadyState()

	useEffect(
		() => {
			if (!initPlayer) {
				return
			}

			initPlayer({
				isPlaying,
				setIsPlaying,
			})
		},
		[initPlayer, isPlaying, setIsPlaying]
	)

	useEffect(
		() => {
			if (isPlaying) {
				onPlay?.()
			} else {
				onPause?.()
			}
		},
		[isPlaying, onPause, onPlay]
	)

	useEffect(
		() => {
			if (!autoPlay) {
				return
			}

			setIsPlaying(true)
		},
		[autoPlay, setIsPlaying]
	)

	return (
		<Button
			onClick={() => setIsPlaying(!isPlaying)}
			className={cn(
				"group/PlayPauseButton",
				"relative aspect-square text-4xl",
				className
			)}
			intent="primary"
			{...props}
			isNarrow
		>
			<WithLoading
				isLoading={readyState === HTMLMediaElement.HAVE_NOTHING}
			>
				{isPlaying
					? (
						<WithIcon
							before="pause"
							containerClassName={cn(
								"Pause",
								"opacity-0 group-hover/PlayPauseButton:opacity-100",
								"scale-y-50 group-hover/PlayPauseButton:scale-y-100",
								"transition duration-300"
							)}
							className="sr-only"
						>
							Pause
						</WithIcon>
					)
					: (
						<WithIcon
							before={isEnded ? "replay" : "play"}
							containerClassName="Play"
							className="sr-only"
						>
							Lecture
						</WithIcon>
					)
				}
				{isPlaying && (
					<Waveform
						className={cn(
							"Waveform",
							"size-[1.2em]",
							"absolute left-1/2 top-1/2 -translate-1/2",
							"transition duration-300",
							"pointer-events-none",
							"group-hover/PlayPauseButton:opacity-0",
							"group-hover/PlayPauseButton:scale-y-0",
						)}
					/>
				)}
			</WithLoading>
		</Button>
	)
}

export type ProgressBarProps = PropsWithClassName

export const ProgressBar = ({ className }: ProgressBarProps) => (
	<ProgressBarRoot
		className={cn(
			"grow relative bg-neutral-900/40 h-6 md:h-10 cursor-pointer flex items-center select-none touch-none overflow-hidden",
			"outline-transparent outline-1 focus-within:outline-white",
			className
		)}
	>
		<Slider.Track className="relative grow h-full">
			<Slider.Range className="absolute h-full bg-primary" />
		</Slider.Track>
		<Slider.Thumb className="block w-px h-6 md:h-10 bg-white outline-none z-20" />
		{!isSafari() && (
			<>
				<Controls.Timestamp type="elapsed" className="absolute h-full left-0 px-3 py-2 md:px-4 md:py-3" />
				<Controls.Timestamp type="duration" className="absolute h-full right-0 px-3 py-2 md:px-4 md:py-3" />
			</>
		)}
	</ProgressBarRoot>
)

export type ControlsVisibilityProps = {
	children: (props: { controlsVisible: boolean }) => ReactNode
}

export const ControlsEventsWrapper = ({ children }: ControlsVisibilityProps) => {
	const [controlsVisible, setControlsVisible] = Media.useMediaOpaque("controlsVisible") as [boolean, (value: boolean) => void]
	const [isPlaying, setIsPlaying] = Media.useMediaPlaying()

	// Hide/show on play/pause
	useEffect(
		() => {
			let timer: number

			const show = () => {
				clearTimeout(timer)
				setControlsVisible(true)
			}

			if (isPlaying) {
				timer = setTimeout(
					() => {
						setControlsVisible(false)
					},
					2000
				)
			} else {
				show()
			}

			return () => {
				show()
			}
		},
		[isPlaying, setControlsVisible]
	)

	// Show on mousemove
	useEffect(
		() => {
			let timer: number

			const handleMouseMove = () => {
				clearTimeout(timer)
				setControlsVisible(true)

				if (isPlaying) {
					timer = setTimeout(
						() => {
							setControlsVisible(false)
						},
						2000
					)
				}
			}

			document.addEventListener("mousemove", handleMouseMove)

			return () => {
				document.removeEventListener("mousemove", handleMouseMove)
			}
		},
		[isPlaying, setControlsVisible]
	)

	// Keyboard events
	useEffect(
		() => {
			const handleKeydown = (event: KeyboardEvent) => {
				if (document.activeElement?.tagName === "BUTTON") {
					return
				}

				if (event.key === " ") {
					setIsPlaying(!isPlaying)
				}
			}

			document.addEventListener("keydown", handleKeydown)

			return () => {
				document.removeEventListener("keydown", handleKeydown)
			}
		},
		[isPlaying, setIsPlaying]
	)

	return children({ controlsVisible })
}

type AudioPlayerProps = PlayerProps & PlayPauseButtonProps

export const AudioPlayer = ({ src, ...props }: AudioPlayerProps) => (
	<Media.Root>
		<Media.Container>
			<Media.Audio src={src} />
		</Media.Container>
		<Media.Viewport className="flex flex-col justify-center items-center gap-4">
			<PlayPauseButton {...props} />
			<Group
				size="px"
				className={cn(
					"text-white [&_svg]:size-4 grow",
					"text-2xs font-mono",
					"backdrop-blur-xl rounded-3xl w-80 max-w-full",
					"flex items-center"
				)}
			>
				<ProgressBar className="rounded-3xl" />
			</Group>
		</Media.Viewport>
	</Media.Root>
)

export const AudioPlayerMini = ({ src, ...props }: AudioPlayerProps) => (
	<Media.Root>
		<Media.Container>
			<Media.Audio src={src} />
		</Media.Container>
		<Media.Viewport>
			<PlayPauseButton {...props} />
		</Media.Viewport>
	</Media.Root>
)

type VideoPlayerProps = PlayerProps & PlayPauseButtonProps

export const VideoPlayer = ({ src, className, ...props }: VideoPlayerProps) => (
	<Media.Root>
		<Media.Container className="relative grid col-span-1 row-span-1 w-full">
			<Media.Video src={src} className="aspect-video col-start-1 row-start-1 self-center w-full" />
		</Media.Container>
		<ControlsEventsWrapper>
			{({ controlsVisible }) => (
				<Media.Viewport className="relative flex justify-center items-center col-start-1 row-start-1">
					<PlayPauseButton
						{...props}
						className={cn(
							"text-white bg-neutral-900/40 backdrop-blur-2xl",
							"focus-visible:outline-white",
							"transition duration-500",
							{
								"not-focus-visible:opacity-0": !controlsVisible,
							},
							className
						)}
					/>
					<div
						className={cn(
							"absolute inset-x-0 bottom-0 pb-2 md:pb-4 lg:pb-10 px-12",
							"transition duration-500",
							{
								"not-focus-within:opacity-0 not-focus-within:translate-y-2 md:not-focus-within:translate-y-2": !controlsVisible,
							},
						)}
					>
						<Group
							size="px"
							className={cn(
								"text-white [&_svg]:size-4 grow",
								"text-2xs font-mono",
								"backdrop-blur-xl rounded-3xl",
								"flex items-center"
							)}
						>
							<ProgressBar className="rounded-l-3xl only:rounded-r-3xl" />
							{!isIos() && (
								<Controls.Fullscreen
									className={cn(
										"pl-3 pr-4 h-8 md:h-10 bg-neutral-900/40 rounded-r-3xl cursor-pointer",
										"outline-transparent outline-1 focus-visible:outline-white",
									)}
								/>
							)}
						</Group>
					</div>
				</Media.Viewport>
			)}
		</ControlsEventsWrapper>
	</Media.Root>
)
