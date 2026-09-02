import type { PropsWithChildren, PropsWithClassName } from "react"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

const fieldAsideVariants = cva(
	[
		"flex items-center px-[1.25em]",
	],
	{
		variants: {
			isLegend: {
				true: "text-neutral text-sm",
			},
			isButton: {
				true: "px-[0.15em]",
			},
			isNested: {
				true: "first:pr-[.5em] last:pl-[.5em]",
				false: "first:pr-[.875em] last:pl-[.875em]",
			},
			isField: {
				true: "p-0 self-stretch shrink-0",
			},
		},
		defaultVariants: {
			isLegend: false,
			isNested: false,
			isField: false,
		},
	}
)

export type FieldAsideVariants = VariantProps<typeof fieldAsideVariants>

export type FieldAsideProps = FieldAsideVariants & PropsWithChildren<PropsWithClassName>

export const FieldAside = ({ isLegend, isNested, isButton, isField, ...props }: FieldAsideProps) => {
	return (
		<span {...props} className={cn(fieldAsideVariants({ isLegend, isNested, isButton, isField }), props.className)} />
	)
}
