import type { ComponentProps } from "react"

import { cn } from "@/utils/cn"

export type WaveformProps = ComponentProps<"svg">

export const Waveform = ({ className, ...props }: WaveformProps) => {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 20 20"
			className={cn(
				"Waveform",
				"inline-flex shrink-0",
				"fill-current",
				"size-[1em]",
				className,
			)}
		>
			<path
				className="animate-waveform-bar"
				style={{
					animationDuration: "1200ms",
					animationDelay: "10ms",
				}}
				d="M9.88,0c.62.06,1.17,1.07,1.23,3.41s0,13.63-.21,15.08c-.2,1.45-1.99,2.4-2.04.25s.05-12.49,0-14.13S8.66-.12,9.88,0Z"
			/>
			<path
				className="animate-waveform-bar-low delay-20 duration-700"
				style={{
					animationDuration: "1000ms",
					animationDelay: "500ms",
				}}
				d="M15.51,14.14c-.05-1.26.05-9.22,0-10.86s-1.84-.92-2.04.19-.26,9.8-.21,11.59.61,2.57,1.23,2.62c1.23.1,1.07-2.28,1.02-3.54Z"
			/>
			<path
				className="animate-waveform-bar delay-75"
				style={{
					animationDuration: "1700ms",
					animationDelay: "75ms",
				}}
				d="M2.2,10.33c.03-1.06.11-3.75.03-5.13-.14-2.65-1.87-2.82-2.02-.68C.15,5.48-.04,12.75,0,14.26s.61,2.16,1.23,2.2c1.23.08.87-2.48.97-6.14Z"
			/>
			<path
				className="animate-waveform-bar-low duration-1200"
				style={{
					animationDuration: "900ms",
					animationDelay: "0ms",
				}}
				d="M5.65,6.08c-.62.03-1.17.42-1.23,1.34s0,5.35.21,5.92,1.99.94,2.04.1-.05-4.9,0-5.54.2-1.86-1.02-1.81Z"
			/>
			<path
				className="animate-waveform-bar delay-100"
				style={{
					animationDuration: "1400ms",
					animationDelay: "150ms",
				}}
				d="M18.91,5.43c-.62.03-1.17.49-1.23,1.56s0,6.23.21,6.89,1.75,1.09,1.92-.61c.1-.97.2-3.34.19-4.23-.01-.75.14-3.67-1.09-3.61Z"
			/>
		</svg>
	)
}
