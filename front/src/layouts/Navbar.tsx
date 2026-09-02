import { Link } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"

import { Icon } from "@/components/Icon"
import type { Icons } from "@/utils/types/icons"
import { MediaFilesFormDrawer } from "@/features/mediaFile/components/MediaFilesFormDrawer"
import { cn } from "@/utils/cn"
import { getMediaTypeLabel } from "@/features/mediaType/utils/labels"
import { mediaTypesQueryOptions } from "@/features/mediaType/api/options"
import { openDrawer } from "@/utils/dialogs"

import { Header } from "./Header"
import { useAuth } from "@/stores/auth"

export const Navbar = () => {
	const { data } = useSuspenseQuery(mediaTypesQueryOptions())
	const canUpload = useAuth(state => state.canUpload)

	return (
		<Header>
			<nav
				className={cn(
					"flex justify-evenly items-center gap-4 is-vertical:px-2 is-horizontal:flex-col is-vertical:grow",
					"is-horizontal:pt-[2vw] is-horizontal:px-[.5vw]",
					"is-vertical:bg-white/80 is-vertical:backdrop-blur-md is-vertical:h-12 rounded-full",
					"translate-0 is-vertical:starting:translate-x-4 is-vertical:starting:opacity-0 is-vertical:transition-all is-vertical:duration-300 is-vertical:starting:duration-800 is-vertical:delay-600",
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
							"is-vertical:size-12 is-vertical:flex-1 is-horizontal:w-full",
							"is-horizontal:py-[.5vw]",
							"flex flex-col justify-center items-center is-vertical:gap-0.5 gap-1 2xl:gap-[.25vw]",
							"text-neutral-600 drop-shadow-px text-3xs 2xl:text-[.5vw] uppercase text-center",
							"translate-0 is-horizontal:starting:translate-y-4 is-horizontal:starting:opacity-0",
							"hover:text-primary cursor-pointer",
							"is-horizontal:hover:bg-primary/5 is-vertical:rounded-full is-horizontal:rounded-lg",
							"outline-2 outline-transparent focus-visible:bg-primary/5 focus-visible:outline-primary",
						)}
						style={{
							transition: `all 800ms ${600 + 100 * index}ms, background-color 300ms 100ms, outline-color 300ms 100ms, color 300ms 100ms`,
						}}
						activeProps={{
							className: "text-primary",
						}}
					>
						<Icon
							name={mediaType as Icons}
							className="size-5 lg:size-[1.5vw]"
						/>
						<span>{getMediaTypeLabel(mediaType)}</span>
					</Link>
				))}
				{canUpload() && (
					<>
						<hr
							className="bg-neutral-300 h-0.5 w-1/2 border-0 rounded-full translate-0 starting:translate-y-2 starting:opacity-0 is-vertical:hidden transition"
							style={{
								transition: `all 800ms ${600 + 100 * data.items.length}ms`,
							}}
						/>
						<button
							className={cn(
								"is-vertical:size-12 is-vertical:flex-1 is-horizontal:w-full",
								"is-horizontal:py-[.5vw]",
								"flex flex-col justify-center items-center is-vertical:gap-0.5 gap-1 2xl:gap-[.25vw]",
								"text-neutral-600 drop-shadow-px text-3xs 2xl:text-[.5vw] uppercase text-center",
								"translate-0 is-horizontal:starting:translate-y-4 is-horizontal:starting:opacity-0",
								"hover:text-accent cursor-pointer",
								"is-horizontal:hover:bg-accent/10 is-vertical:rounded-full is-horizontal:rounded-lg",
								"outline-2 outline-transparent focus-visible:bg-accent/15 focus-visible:outline-accent",
							)}
							style={{
								transition: `all 800ms ${600 + 100 * (data.items.length + 1)}ms, background-color 300ms 100ms, outline-color 300ms 100ms, color 300ms 100ms`,
							}}
							onClick={() => openDrawer(<MediaFilesFormDrawer />)}
						>
							<Icon
								name="add"
								className="size-5 lg:size-[1.5vw]"
							/>
							<span>Ajouter</span>
						</button>
					</>
				)}
			</nav>
		</Header>
	)
}
