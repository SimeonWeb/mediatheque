import type { ComponentProps } from "react"

import type { Moment } from "@/features/moment/api/types"
import { cn } from "@/utils/cn"

import { Badge } from "./Badge"
import { Heading } from "./Heading"

export type MediaGridMomentProps = ComponentProps<"div"> & {
	moment: Moment
}

export const MediaGridMoment = ({ moment, className, ...props }: MediaGridMomentProps) => !!moment.label && (
	<>
		<Heading
			id={moment.slug}
			like="h5"
			className={cn(
				"Moment",
				"relative",
				"col-start-1 col-span-full",
				"bg-white",
				"is-horizontal:text-lg",
				"pt-3 is-horizontal:pt-[1.5vw] pb-1.5",
				"translate-0 starting:opacity-0 starting:translate-y-4",
				"transition duration-500",
				"[:first-child>&]:hidden -mb-10",
				"z-11",
			)}
			{...props}
		>
			{moment.label}
		</Heading>
		<div
			className={cn(
				"MomentSticky",
				"col-start-1 col-span-full",
				"sticky top-2 is-horizontal:top-[2.5vw]",
				"h-10 [:first-child>&]:-mb-10",
				"translate-0 starting:opacity-0 starting:translate-y-4",
				"transition duration-500",
				"z-10",
			)}
			{...props}
			aria-hidden
		>
			<div className="flex pl-2 pt-2 pb-1 is-horizontal:pl-[1vw] is-horizontal:pt-[1vw]">
				<Badge
					intent="neutral"
					className="bg-white/60 backdrop-blur-xl cursor-pointer"
					onClick={() => window.scroll({
						top: document.getElementById(moment.slug)?.offsetTop,
						behavior: "smooth",
					})}
				>
					{moment.label}
				</Badge>
			</div>
		</div>
	</>
)
