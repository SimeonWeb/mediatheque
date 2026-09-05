import { cn } from "@/utils/cn"

export type TableProps = React.ComponentProps<"table"> & {
	isNarrow?: boolean
}

export const Table = ({ className, isNarrow, ...props }: TableProps) => (
	<table
		{...props}
		className={cn(
			"Table",
			"border-separate border-spacing-0",
			{
				"[&_.Head]:first:pl-0 [&_.Head]:nth-[2]:pl-0 [&_.Head]:last:pr-0": isNarrow,
				"[&_.Cell]:first:pl-0 [&_.Cell]:nth-[2]:pl-0 [&_.Cell]:last:pr-0": isNarrow,
			},
			className
		)}
	/>
)

export const THead = ({ className, ...props }: React.ComponentProps<"thead">) => (
	<thead {...props} className={cn("THead", className)} />
)

export const TBody = ({ className, ...props }: React.ComponentProps<"tbody">) => (
	<tbody {...props} className={cn("TBody", className)} />
)

export const TFoot = ({ className, ...props }: React.ComponentProps<"tfoot">) => (
	<tfoot {...props} className={cn("TFoot", className)} />
)

export const Row = ({ className, ...props }: React.ComponentProps<"tr">) => (
	<tr
		{...props}
		className={cn(
			"Row group",
			className
		)}
	/>
)

export type HeadProps = React.ComponentProps<"th">

export const Head = ({ className, ...props }: HeadProps) => (
	<th
		{...props}
		className={cn(
			"Head",
			"border-b border-neutral-700",
			"py-2 md:py-3",
			"px-2.5 first:pl-5 last:pr-5 md:px-3 md:first:pl-6 md:last:pr-6",
			"text-2xs font-normal uppercase text-left",
			"text-neutral-300",
			className
		)}
	/>
)

export type CellProps = React.ComponentProps<"td"> & {
	as?: "td" | "th"
}

export const Cell = ({ as: Tag = "td", className, ...props }: CellProps) => (
	<Tag
		{...props}
		className={cn(
			"Cell",
			"[tr:not(:last-child)_&]:border-b border-neutral-700",
			"py-2.5 md:py-3.5",
			"px-2.5 first:pl-5 last:pr-5 md:px-3 md:first:pl-6 md:last:pr-6",
			"text-sm font-normal [th]:font-semibold text-left",
			"text-neutral-300",
			"transition-colors",
			className
		)}
	/>
)
