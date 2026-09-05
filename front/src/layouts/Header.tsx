import { Link } from "@tanstack/react-router"
import type { PropsWithChildren } from "react"

import { Icon } from "@/components/Icon"
import { cn } from "@/utils/cn"

export const Header = ({ children }: PropsWithChildren) => {
	return (
		<header
			className={cn(
				"fixed bottom-0 left-0 is-horizontal:top-0",
				"is-vertical:flex",
				"h-16 w-full is-horizontal:h-full is-horizontal:w-16 lg:is-horizontal:w-[6vw]",
				"is-vertical:gap-2 is-vertical:px-4",
				"z-30"
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
					className="flex justify-between w-58 lg:w-[22vw] cursor-pointer outline-2 outline-offset-8 rounded-lg outline-transparent focus-visible:outline-primary"
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
					"size-12 is-horizontal:hidden relative bg-white/80 backdrop-blur-xl text-primary rounded-full",
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

			{children}
		</header>
	)
}
