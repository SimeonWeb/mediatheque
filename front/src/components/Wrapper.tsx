import { type ComponentProps, type ElementType } from "react"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

const wrapperVariants = cva(
	[
		"p-5 gap-5",
		"md:p-6 md:gap-6",
	],
	{
		variants: {
			isIso: {
				true: "",
				false: "py-2.5 md:py-3",
			},
			direction: {
				vertical: "px-0 md:px-0",
				horizontal: "py-0 md:py-0",
			},
		},
		defaultVariants: {
			isIso: false,
		},
	},
)


export type WrapperVariants = VariantProps<typeof wrapperVariants>

type WrapperBaseProps<TElement extends ElementType> = WrapperVariants & {
	as?: TElement
}

export type WrapperProps<TElement extends ElementType = "div"> = (
	WrapperBaseProps<TElement>
	& Omit<ComponentProps<TElement>, keyof WrapperBaseProps<TElement>>
)

export const Wrapper = <TElement extends ElementType = "div">({
	as,
	isIso,
	direction,
	className,
	...props
}: WrapperProps<TElement>) => {
	const Tag = as || "div"

	return (
		<Tag
			{...props}
			className={cn(wrapperVariants({ isIso, direction }), className)}
		/>
	)
}
