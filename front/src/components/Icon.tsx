import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

import type { Icons } from "@/utils/types/icons"
import { cn } from "@/utils/cn"

const iconVariants = cva(
	[
		"Icon",
		"inline-flex shrink-0",
		"fill-current",
	],
	{
		variants: {
			size: {
				base: [
					"size-[1em]",
				],
				sm: [
					"size-[.875em]",
				],
			},
		},
		defaultVariants: {
			size: "base",
		},
	},
)

export type IconVariants = VariantProps<typeof iconVariants>

export type IconProps = IconVariants & ComponentProps<"svg"> & {
	name: Icons
	label?: string
	className?: string
}

export const Icon = ({
	name,
	label,
	size,
	className,
	...props
}: IconProps) => (
	<svg
		{...props}
		className={cn(
			iconVariants({ size }),
			className,
		)}
		aria-hidden={!label ? true : undefined}
		aria-label={label ? label : undefined}
		role={label ? "img" : undefined}
	>
		<use href={`/assets/icons.svg#${name}`} />
	</svg>
)
