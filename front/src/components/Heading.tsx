import { type VariantProps, cva } from "class-variance-authority"
import type { ComponentProps } from "react"

import { cn } from "@/utils/cn"

const headingVariants = cva(
	[
		"Heading",
		"text-neutral-highlight",
		"font-bold",
	],
	{
		variants: {
			level: {
				h1: "font-display text-xl md:text-2xl leading-tight",
				h2: "font-display text-lg md:text-xl leading-tight",
				h3: "text-xl leading-tight",
				h4: "text-lg leading-tight",
				h5: "text-base leading-tight",
				h6: "text-sm leading-tight",
			},
		},
	},
)

export type HeadingVariants = VariantProps<typeof headingVariants>
export type HeadingLevel = NonNullable<HeadingVariants["level"]>

export type HeadingProps<L extends React.ElementType> = ComponentProps<L> & {
	as?: L
	like?: HeadingLevel
}

const headingLevels: HeadingLevel[] = ["h1", "h2", "h3", "h4", "h5", "h6"]

export const Heading = <L extends React.ElementType>({ as, like, ...props }: HeadingProps<L>) => {
	const Tag = as || "div"
	const dataLevel = like || "h1"
	const level = like || (headingLevels.includes(as) ? as : "h1")

	return (
		<Tag
			{...props}
			data-level={dataLevel}
			className={cn(
				headingVariants({ level }),
				props.className,
			)}
		/>
	)
}
