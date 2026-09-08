import type { ComponentProps } from "react"

import { cn } from "@/utils/cn"

export interface LabelProps extends ComponentProps<"label"> {
	isInline?: boolean
}

export const Label = ({ isInline, children, ...props }: LabelProps) => {
	return (
		<label
			{...props}
			className={cn(
				"font-medium text-neutral cursor-pointer leading-tight",
				{
					"uppercase": isInline,
				},
				props.className
			)}
		>
			<span
				className={cn(
					"text-[calc(var(--em-spacing)*3.5)]",
					{
						"text-[calc(var(--em-spacing)*3)]": isInline,
					}
				)}
			>
				{children}
			</span>
		</label>
	)
}
