import type { PropsWithChildren, PropsWithClassName } from "react"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

import { Heading } from "./Heading"
import { Icon } from "./Icon"

const alertVariants = cva(
	[
		"Alert",
		"flex items-center gap-[calc(var(--em-spacing)*4)]",
		"px-5 py-3",
		"md:px-6 md:py-4",
		"rounded-xl",
		"leading-tight",
		"ring-1 ring-primary-1",
	],
	{
		variants: {
			intent: {
				error: [
					"bg-error-support text-neutral-highlight [&_.AlertIcon]:text-error",
				],
				warning: [
					"bg-warning-support text-neutral-highlight [&_.AlertIcon]:text-warning",
				],
				info: [
					"bg-info-support text-neutral-highlight [&_.AlertIcon]:text-info",
				],
			},
		},
		defaultVariants: {
			intent: "error",
		},
	}
)

export type AlertVariants = VariantProps<typeof alertVariants>

export type AlertProps = PropsWithChildren<PropsWithClassName<AlertVariants & { title?: React.ReactNode }>>

export const Alert = ({ intent = "error", title, className, children }: AlertProps) => (
	<div className={cn(alertVariants({ intent }), className)}>
		<div className="flex flex-col gap-[calc(var(--em-spacing)*2)] grow">
			{!!title && <Heading like="h5" className="text-current text-[calc(var(--em-spacing)*4)]">{title}</Heading>}
			{!!children && (
				<div className="flex flex-col gap-[calc(var(--em-spacing)*2)] text-[calc(var(--em-spacing)*3.5)] items-start font-medium opacity-90">
					{children}
				</div>
			)}
		</div>
		<div className="shrink-0">
			<Icon name={intent!} className="AlertIcon text-[calc(var(--em-spacing)*5)]" />
		</div>
	</div>
)
