import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/utils/cn"

const badgeVariants = cva(
	[
		"Badge",
		"inline-flex items-center justify-center",
		"align-middle",
		"shrink-0",
		"px-[calc(var(--em-spacing)*2)]",
		"h-[calc(var(--em-spacing)*7)] min-w-[calc(var(--em-spacing)*7)] max-w-full",
		"font-sans font-medium",
		"transition-colors",
	],
	{
		variants: {
			size: {
				base: [
					"text-xs leading-tight",
				],
				sm: [
					"text-2xs leading-tight",
				],
				lg: [
					"text-sm leading-tight",
				],
				inherit: [
					"text-[calc(var(--em-spacing)*3)] leading-tight",
				],
			},
			intent: {
				primary: [
					"bg-primary text-white",
				],
				secondary: [
					"bg-primary-4 text-neutral-highlight",
				],
				tertiary: [
					"bg-primary-3 text-neutral-highlight",
				],
				"neutral-highlight": [
					"bg-neutral-highlight text-primary-1",
				],
				"neutral-support": [
					"bg-neutral-support text-neutral-highlight",
					"group-hover/interactive:bg-neutral-support-highlight",
				],
				"status-1": [
					"bg-status-1 text-neutral-highlight",
				],
				"status-1-support": [
					"bg-status-1-support text-neutral-highlight",
					"group-hover/interactive:bg-status-1-support-highlight",
				],
				"status-2": [
					"bg-status-2 text-neutral-highlight",
				],
				"status-2-support": [
					"bg-status-2-support text-neutral-highlight",
					"group-hover/interactive:bg-status-2-support-highlight",
				],
				"status-3": [
					"bg-status-3 text-neutral-highlight",
				],
				"status-3-support": [
					"bg-status-3-support text-neutral-highlight",
					"group-hover/interactive:bg-status-3-support-highlight",
				],
				error: [
					"bg-error text-white",
				],
				"error-support": [
					"bg-error-support text-neutral-highlight",
					"group-hover/interactive:bg-error-support-highlight",
				],
				warning: [
					"bg-warning text-black",
				],
				"warning-support": [
					"bg-warning-support text-neutral-highlight",
					"group-hover/interactive:bg-warning-support-highlight",
				],
				info: [
					"bg-info text-white",
				],
				"info-support": [
					"bg-info-support text-neutral-highlight",
					"group-hover/interactive:bg-info-support-highlight",
				],
				neutral: [
					"bg-neutral-200 text-neutral-900",
				],
				dark: [
					"bg-neutral-800 text-neutral-100",
				],
			},
			outlined: {
				true: "ring-1 ring-primary-1/50",
			},
			rounded: {
				true: "rounded-full",
				false: "rounded",
			},
		},
		defaultVariants: {
			size: "base",
			intent: "primary",
			rounded: true,
		},
	}
)

export type BadgeVariants = VariantProps<typeof badgeVariants>

export type BadgeProps = BadgeVariants & ComponentProps<"span">

export const Badge = ({ size, intent, rounded, outlined, children, ...props }: BadgeProps) => (
	<span {...props} className={cn(badgeVariants({ size, intent, rounded, outlined }), props.className)}>
		<span
			className={cn(
				"block truncate",
				// Trick to improve "icon only" badge
				"has-[.WithIcon>.sr-only]:overflow-visible"
			)}
		>
			{children}
		</span>
	</span>
)
