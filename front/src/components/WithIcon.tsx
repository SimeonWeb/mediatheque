import type { PropsWithChildren, PropsWithClassName } from "react"

import type { Icons } from "@/utils/types/icons"
import { cn } from "@/utils/cn"

import { Icon } from "./Icon"

export type WithIconProps = PropsWithChildren<PropsWithClassName<(
	{
		isNarrow?: boolean
		containerClassName?: string
	}
	& (
		{
			before: Icons
			after?: Icons
		} | {
			before?: Icons
			after: Icons
		}
	)
)>>

export const WithIcon = ({ children, before, after, isNarrow, className, containerClassName }: WithIconProps) => (
	<span
		className={cn(
			"WithIcon",
			"flex grow justify-center items-center gap-[calc(var(--tw-leading,var(--leading-tight))*.203em*2)]",
			containerClassName
		)}
	>
		<Icon
			name={before || after}
			className={cn(
				"h-[calc(var(--tw-leading,var(--leading-tight))*1em)]", // Button default line height
				"w-[calc(var(--tw-leading,var(--leading-tight))*1em)]",
				"has-[+_.sr-only]:mx-[calc(-0.203em*var(--tw-leading,var(--leading-tight)))]",
				"only:mx-[calc(-0.203em*var(--tw-leading,var(--leading-tight)))]",
				{
					"leading-none": isNarrow,
					"order-1": after,
				},
			)}
		/>
		{!!children && (
			<span
				className={cn(
					"block truncate",
					"order-0",
					className
				)}
			>
				{children}
			</span>
		)}
	</span>
)
