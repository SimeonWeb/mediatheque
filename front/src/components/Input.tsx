import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/utils/cn"

const inputVariants = cva(
	[
		"w-full",
		"px-[1.25em] py-[.75em] [[type=date]]:pr-[.75em]",
		"outline not-read-only:focus-visible:outline-2",
		"in-[.FieldControl]:text-[1em]",
		"in-[.FieldControl]:not-first:pl-0 in-[.FieldControl]:not-last:pr-0",
		"in-[.FieldControl]:outline-0!",
		"in-[.FieldControl]:bg-transparent in-[.FieldControl]:text-current",
		"has-[+_.FieldError]:outline-2 has-[+_.FieldError]:outline-error! has-[+_.FieldError]:relative",
		"transition",

		// File
		"file:text-sm file:leading-tight file:font-medium",
		"file:px-[.904em] file:py-[.65em] file:ml-[-1.125em] file:my-[-0.65em] file:mr-[1.25em]",
		"file:outline-2 file:outline-offset-2 file:outline-transparent",
		"file:cursor-pointer",
		"file:rounded-sm",
		"file:-translate-y-px",
		"data-disabled:file:opacity-50",
		"data-disabled:file:cursor-not-allowed",
		"file:transition",
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
					"bg-white disabled:bg-neutral-300",
					"text-neutral-900 placeholder:text-neutral-500 disabled:text-neutral-500",
					"outline-neutral-200 not-read-only:focus-visible:outline-primary disabled:outline-neutral-400",

					// File
					"file:text-white/90 hover:not-data-disabled:file:text-white",
					"file:bg-primary-4/80 hover:not-data-disabled:file:bg-primary-4",
					"focus-visible:file:outline-primary",
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

export type InputVariants = VariantProps<typeof inputVariants>

export type InputProps = InputVariants & Omit<ComponentProps<"input">, "size">

const isSelected = (value: InputProps["value"]) => typeof value !== "undefined" && value !== ""

export const Input = ({ size, intent, rounded, ...props }: InputProps) => (
	<input
		{...props}
		data-selected={isSelected(props.value)}
		className={cn(inputVariants({ size, intent, rounded }), props.className)}
	/>
)
