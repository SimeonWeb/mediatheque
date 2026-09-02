import type { PropsWithChildren, PropsWithClassName } from "react"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

const fieldControlVariants = cva(
	[
		"FieldControl",
		"flex items-center",
		"w-full",
		"outline outline-transparent has-focus-within:has-[.FieldInput:not(:read-only)]:outline-2 has-data-focus:outline-2",
		"has-[+_.FieldError]:outline-2 has-[+_.FieldError]:outline-error! has-[+_.FieldError]:relative",
		"has-focus-within:has-[.FieldInput:not(:read-only)]:relative has-data-focus:relative",
		"transition",
	],
	{
		variants: {
			size: {
				inherit: [
					"text-[1em] leading-tight",
				],
			},
			intent: {
				default: [
					"bg-white has-[.FieldInput:disabled]:bg-neutral-300 has-[.FieldInput:disabled]:has-aria-readonly:bg-white",
					"text-neutral-900 placeholder:text-neutral-500 has-[.FieldInput:disabled]:text-neutral-500 has-[.FieldInput:disabled]:has-aria-readonly:text-neutral-900",
					"outline-neutral-300 has-focus-within:has-[.FieldInput:not(:read-only)]:outline-primary has-data-focus:outline-primary has-[.FieldInput:disabled]:outline-neutral-400 has-[.FieldInput:disabled]:has-aria-readonly:outline-neutral-300",
				],
			},
			rounded: {
				true: "rounded-full",
				false: "rounded-lg",
			},
		},
		defaultVariants: {
			size: "inherit",
			intent: "default",
			rounded: true,
		},
	},
)

export type FieldControlVariants = VariantProps<typeof fieldControlVariants>

export type FieldControlProps = FieldControlVariants & PropsWithChildren<PropsWithClassName>

export const FieldControl = ({ size, intent, rounded, ...props }: FieldControlProps) => (
	<div {...props} className={cn(fieldControlVariants({ size, intent, rounded }), props.className)} />
)
