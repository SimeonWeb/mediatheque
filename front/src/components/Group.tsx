import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/utils/cn"

const groupVariants = cva(
	[
		"Group",
		"flex",
	],
	{
		variants: {
			size: {
				px: "gap-px",
				sm: "gap-0.5",
				base: "gap-1",
				lg: "gap-2",
				xl: "gap-4 md:gap-5",
				"2xl": "gap-5 md:gap-6",
			},
			isNarrow: {
				true: [
					"gap-0 md:gap-0",
					"[&:not(.flex-col)>*]:not-first:rounded-l-none [&:not(.flex-col)>*]:not-last:rounded-r-none",
					"[&.flex-col>*]:not-first:rounded-t-none [&.flex-col>*]:not-last:rounded-b-none",
				],
				false: "",
			},
		},
		defaultVariants: {
			size: "2xl",
			isNarrow: false,
		},
		compoundVariants: [
			{
				isNarrow: true,
				size: "px",
				className: "gap-px md:gap-px",
			},
		],
	}
)

export type GroupVariants = VariantProps<typeof groupVariants>

export type GroupProps = GroupVariants & ComponentProps<"div">

export const Group = ({ size, isNarrow, ...props }: GroupProps) => (
	<div {...props} className={cn(groupVariants({ size, isNarrow }), props.className)} />
)
