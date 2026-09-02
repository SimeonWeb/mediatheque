import { Link, type LinkProps } from "@tanstack/react-router"
import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/utils/cn"

const buttonVariants = cva(
	[
		"Button",
		"group/button",
		"inline-flex items-center justify-center text-center",
		"font-medium",
		"cursor-pointer",
		"transition",
		"outline-2 outline-transparent outline-offset-2",
		"px-[1.2em] py-[.947em]",
		"data-disabled:opacity-50",
		"data-disabled:cursor-not-allowed",
	],
	{
		variants: {
			size: {
				lg: [
					"text-base leading-tight",
				],
				base: [
					"text-sm leading-tight",
				],
				sm: [
					"text-xs leading-tight",
				],
				inherit: [
					"text-[0.875em] leading-tight",
				],
			},
			isNarrow: {
				true: "px-[.904em] py-[.65em]",
				false: "",
			},
			intent: {
				primary: [
					"text-white/90 hover:not-data-disabled:text-white data-open:text-white",
					"bg-primary hover:not-data-disabled:bg-primary-highlight data-open:bg-primary-highlight",
					"focus-visible:outline-primary/70",
				],
				secondary: [
					"text-neutral-800 hover:not-data-disabled:text-neutral-900 data-open:text-neutral-900",
					"bg-neutral-200 hover:not-data-disabled:bg-neutral-300 data-open:bg-neutral-300",
					"focus-visible:outline-neutral-400",
				],
				tertiary: [
					"text-accent-1/80 hover:not-data-disabled:text-accent-1 data-open:text-accent-1",
					"bg-primary-3/70 hover:not-data-disabled:bg-primary-3 data-open:bg-primary-3",
					"focus-visible:outline-primary-4",
				],
				error: [
					"text-white/90 hover:not-data-disabled:text-white data-open:text-white",
					"bg-error hover:not-data-disabled:bg-error-highlight data-open:bg-error-highlight",
					"focus-visible:outline-error/70",
				],
				warning: [
					"text-black/80 hover:not-data-disabled:text-black data-open:text-black",
					"bg-warning hover:not-data-disabled:bg-warning-highlight data-open:bg-warning-highlight",
					"focus-visible:outline-warning/70",
				],
				info: [
					"text-black/80 hover:not-data-disabled:text-black data-open:text-black",
					"bg-info hover:not-data-disabled:bg-info-highlight data-open:bg-info-highlight",
					"focus-visible:outline-info/70",
				],
				text: [
					"outline-offset-0",
					"text-current",
					"hover:not-data-disabled:text-neutral-900 data-open:text-neutral-900",
					"focus-visible:text-neutral-900",
					"hover:not-data-disabled:bg-neutral-100 data-open:bg-neutral-100",
					"focus-visible:outline-neutral-400",
				],
			},
			rounded: {
				true: "rounded-full",
				false: "rounded-lg",
			},
		},
		defaultVariants: {
			size: "base",
			isNarrow: false,
			intent: "secondary",
			rounded: true,
		},
	},
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

export interface ButtonProps extends Omit<ButtonVariants, "disabled">, ComponentProps<"button"> {
	readOnly?: boolean
}

export const Button = ({ size, isNarrow, intent, rounded, readOnly, disabled, ...props }: ButtonProps) => (
	<button
		{...props}
		disabled={readOnly || disabled}
		data-disabled={disabled ? true : undefined}
		data-readonly={readOnly ? true : undefined}
		className={cn(
			buttonVariants({ size, isNarrow, intent, rounded }),
			props.className,
		)}
	/>
)

export interface LinkButtonProps extends ButtonVariants, Omit<ComponentProps<"a">, "children" | "target">, LinkProps {
	readOnly?: boolean
}

export const LinkButton = ({ size, isNarrow, intent, rounded, readOnly, disabled, ...props }: LinkButtonProps) => (
	<Link
		{...props}
		disabled={readOnly || disabled}
		data-disabled={disabled ? true : undefined}
		data-readonly={readOnly ? true : undefined}
		className={cn(
			buttonVariants({ size, isNarrow, intent, rounded }),
			props.className,
		)}
	/>
)

export type ExternalLinkButtonProps = ButtonVariants & ComponentProps<"a"> & {
	disabled?: boolean
	readOnly?: boolean
	withoutIcon?: boolean
}

export const ExternalLinkButton = ({ size, isNarrow, intent, rounded, readOnly, disabled, children, ...props }: ExternalLinkButtonProps) => (
	<a
		{...props}
		aria-disabled={disabled}
		data-disabled={disabled ? true : undefined}
		data-readonly={readOnly ? true : undefined}
		onClick={disabled || readOnly
			? event => event.preventDefault()
			: props.onClick
		}
		className={cn(
			buttonVariants({ size, isNarrow, intent, rounded }),
			props.className,
		)}
	>
		{children}
	</a>
)
