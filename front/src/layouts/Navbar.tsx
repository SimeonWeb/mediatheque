import { Link } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { Icon } from "@/components/Icon"
import type { Icons } from "@/utils/types/icons"
import { cn } from "@/utils/cn"
import { getMediaTypeLabel } from "@/features/mediaType/utils/labels"
import { mediaTypesQueryOptions } from "@/features/mediaType/api/options"

export const Navbar = () => {
	const { data } = useSuspenseQuery(mediaTypesQueryOptions())

	return (
		<header
			className={cn(
				"fixed bottom-0 left-0 is-horizontal:top-0",
				"is-vertical:flex",
				"h-16 w-full is-horizontal:h-full is-horizontal:w-16 lg:is-horizontal:w-[6vw]",
				"is-vertical:gap-2 is-vertical:px-4 is-horizontal:pt-[1vw]",
				"z-50"
			)}
		>
			<hgroup
				className={cn(
					"absolute bottom-[3vw] left-0 h-16 lg:h-[6vw]",
					"flex items-center",
					"rotate-270 origin-bottom-left translate-x-16 lg:translate-x-[6vw]",
					"starting:translate-y-4 starting:opacity-0 transition duration-800 delay-300",
					"is-vertical:hidden"
				)}
			>
				<Link
					to="/"
					className="flex justify-between w-58 lg:w-[22vw] cursor-pointer"
				>
					<h1 className="w-[55%]">
						<img src="/assets/mariesimon.svg" className="block w-full" alt="Marie • Simon" />
					</h1>
					<img src="/assets/date.svg" className="block w-1/3" alt="11.07.2026" />
				</Link>
			</hgroup>

			<Link
				to="/"
				className={cn(
					"size-12 is-horizontal:hidden relative bg-white/80 backdrop-blur-md text-primary rounded-full",
					"flex items-center justify-center",
					"is-vertical:starting:-translate-x-4 is-vertical:starting:opacity-0",
					"is-vertical:transition-all duration-300 starting:duration-800 delay-600",
					"cursor-pointer",
				)}
				activeProps={{
					className: "-ml-14 opacity-0 cursor-default!",
					"aria-disabled": true,
				}}
			>
				<h1 className="size-8.5">
					<Icon name="home" className="block size-full" label="Marie • Simon • 11.07.2026" />
				</h1>
			</Link>

			<nav
				className={cn(
					"flex justify-evenly is-vertical:gap-2 is-vertical:px-2 is-horizontal:flex-col is-vertical:grow",
					"bg-white/80 backdrop-blur-md is-vertical:h-12 rounded-full",
					"is-vertical:starting:translate-x-4 is-vertical:starting:opacity-0 is-vertical:transition-all is-vertical:duration-300 is-vertical:starting:duration-800 is-vertical:delay-600",
				)}
				role="navigation"
				aria-label="Menu"
			>
				{data.items.map(({ type: mediaType, total }, index) => total > 0 && (
					<Link
						key={mediaType}
						to="/$mediaType"
						params={{
							mediaType,
						}}
						className={cn(
							"size-12 is-horizontal:size-16 lg:is-horizontal:size-[6vw]",
							"flex flex-col justify-center items-center gap-0.5 is-horizontal:gap-1",
							"text-neutral-600 drop-shadow-px text-3xs uppercase text-center",
							"is-horizontal:starting:translate-y-4 is-horizontal:starting:opacity-0 is-horizontal:transition duration-800",
							"cursor-pointer"
						)}
						style={{
							transitionDelay: `${600 + 100 * index}ms`,
						}}
						activeProps={{
							className: "text-primary",
						}}
					>
						<Icon
							name={mediaType as Icons}
							className="size-5 is-horizontal:size-6"
						/>
						<span>{getMediaTypeLabel(mediaType)}</span>
					</Link>
				))}
			</nav>
		</header>
	)
}
