import { type ComponentProps, type ElementType } from "react"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

const wrapperVariants = cva(
	[
		"Wrapper",
	],
	{
		variants: {
			isIso: {
				true: "",
				false: "",
			},
			size: {
				base: "p-4 gap-4",
				lg: "p-6 gap-6",
				xl: "p-8 gap-8",
				"2xl": "p-12 gap-12",
			},
			direction: {
				vertical: "px-0 md:px-0",
				horizontal: "py-0 md:py-0",
			},
		},
		compoundVariants: [
			{
				isIso: false,
				size: "base",
				className: "py-3 gap-3",
			},
			{
				isIso: false,
				size: "lg",
				className: "py-4.5 gap-4.5",
			},
			{
				isIso: false,
				size: "xl",
				className: "py-6 gap-6",
			},
			{
				isIso: false,
				size: "2xl",
				className: "py-9 gap-9",
			},
		],
		defaultVariants: {
			isIso: false,
			size: "base",
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
	size,
	direction,
	className,
	...props
}: WrapperProps<TElement>) => {
	const Tag = as || "div"

	return (
		<Tag
			{...props}
			className={cn(wrapperVariants({ isIso, size, direction }), className)}
		/>
	)
}
