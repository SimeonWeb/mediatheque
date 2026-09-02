import type { ComponentProps, ElementType } from "react"
import { Link, type LinkProps } from "@tanstack/react-router"
import { type VariantProps, cva } from "class-variance-authority"

import { cn } from "@/utils/cn"

import { Wrapper, type WrapperProps } from "./Wrapper"

const cardVariants = cva(
	[
		"Card",
		"flex flex-wrap flex-col gap-px",
	],
	{
		variants: {
			isOutlined: {
				true: "CardOutlined",
			},
		},
		defaultVariants: {
			isOutlined: false,
		},
	}
)

export type CardVariants = VariantProps<typeof cardVariants>

const cardItemVariants = cva(
	[
		"CardItem",
		"ring ring-white in-[.CardOutlined]:ring-neutral-200",
		"first:rounded-t-xl last:rounded-b-xl",
	],
	{
		variants: {
			intent: {
				default: [
					"bg-primary-3 in-[.CardOutlined]:bg-transparent",
					"text-neutral",
				],
				error: [
					"bg-error-support in-[.CardOutlined]:bg-transparent",
					"text-error-highlight",
				],
				warning: [
					"bg-warning-support in-[.CardOutlined]:bg-transparent",
					"text-warning-highlight",
				],
				info: [
					"bg-info-support in-[.CardOutlined]:bg-transparent",
					"text-info-highlight",
				],
			},
		},
		defaultVariants: {
			intent: "default",
		},
	}
)

export type CardItemVariants = VariantProps<typeof cardItemVariants>

const cardInteractiveItemVariants = cva(
	[
		"group",
		"text-left",
		"transition-colors",
		"outline-2 outline-transparent",
		"not-aria-disabled:cursor-pointer",
		"in-[.CardOutlined]:focus-visible:bg-white",
		"in-[.CardOutlined]:has-focus-visible:bg-white",
	],
	{
		variants: {
			intent: {
				default: [
					"focus-visible:bg-neutral-200 in-[.CardOutlined]:focus-visible:outline-neutral-400",
					"has-focus-visible:bg-neutral-200 in-[.CardOutlined]:has-focus-visible:outline-neutral-400",
					"hover:not-aria-disabled:bg-neutral-300 in-[.CardOutlined]:hover:not-aria-disabled:bg-neutral-200",
				],
				error: [
					"focus-visible:bg-error-support-highlight in-[.CardOutlined]:focus-visible:bg-error-support-highlight",
					"has-focus-visible:bg-error-support-highlight in-[.CardOutlined]:has-focus-visible:bg-error-support-highlight",
					"hover:not-aria-disabled:bg-error-support-highlight in-[.CardOutlined]:hover:not-aria-disabled:bg-error-support-highlight",
				],
				warning: [
					"focus-visible:bg-warning-support-highlight in-[.CardOutlined]:focus-visible:bg-warning-support-highlight",
					"has-focus-visible:bg-warning-support-highlight in-[.CardOutlined]:has-focus-visible:bg-warning-support-highlight",
					"hover:not-aria-disabled:bg-warning-support-highlight in-[.CardOutlined]:hover:not-aria-disabled:bg-warning-support-highlight",
				],
				info: [
					"focus-visible:bg-info-support-highlight in-[.CardOutlined]:focus-visible:bg-info-support-highlight",
					"has-focus-visible:bg-info-support-highlight in-[.CardOutlined]:has-focus-visible:bg-info-support-highlight",
					"hover:not-aria-disabled:bg-info-support-highlight in-[.CardOutlined]:hover:not-aria-disabled:bg-info-support-highlight",
				],
			},
			isSelected: {
				true: "",
				false: "",
			},
		},
		defaultVariants: {
			intent: "default",
			isSelected: false,
		},
		compoundVariants: [
			{
				intent: "default",
				isSelected: true,
				className: "bg-primary-4",
			},
			{
				intent: "error",
				isSelected: true,
				className: "bg-error-support-highlight",
			},
			{
				intent: "warning",
				isSelected: true,
				className: "bg-warning-support-highlight",
			},
			{
				intent: "info",
				isSelected: true,
				className: "bg-info-support-highlight",
			},
		],
	},
)

export type CardInteractiveItemVariants = VariantProps<typeof cardInteractiveItemVariants>

export type CardBaseProps<TElement extends ElementType = "div"> = CardVariants & {
	as?: TElement
}

export type CardProps<TElement extends ElementType = "div"> = (
	CardBaseProps<TElement>
	& Omit<ComponentProps<TElement>, keyof CardBaseProps<TElement>>
)

export const Card = <TElement extends ElementType>({
	as,
	id,
	isOutlined,
	className,
	...props
}: CardProps<TElement>) => {
	const Tag = as || "section"

	return (
		<Tag
			id={id}
			{...props}
			className={cn(cardVariants({ isOutlined }), className)}
		/>
	)
}

export type CardItemProps<TElement extends ElementType = "div"> = (
	CardItemVariants
	& WrapperProps<TElement>
)

export const CardItem = <TElement extends ElementType = "div">({ intent, className, ...props }: CardItemProps<TElement>) => (
	<Wrapper
		className={cn(cardItemVariants({ intent }), className)}
		{...props as WrapperProps<TElement>}
	/>
)

export type CardHeaderProps = CardItemProps<"header">

export const CardHeader = ({ className, ...props }: CardHeaderProps) => (
	<CardItem
		as="header"
		className={cn(
			"CardHeader",
			"bg-primary-4 in-[.CardOutlined]:bg-primary-3",
			className
		)}
		{...props}
	/>
)

export type CardLinkProps = CardInteractiveItemVariants & LinkProps & CardItemProps<"a">

export const CardLink = ({ intent, isSelected, className, ...props }: CardLinkProps) => (
	<Wrapper
		as={Link}
		className={cn(
			"CardItem CardLink",
			cardItemVariants({ intent }),
			cardInteractiveItemVariants({ isSelected, intent }),
			className
		)}
		{...props}
	/>
)

export type CardButtonProps = CardInteractiveItemVariants & CardItemProps<"button">

export const CardButton = ({ intent, isSelected, className, ...props }: CardButtonProps) => (
	<Wrapper
		as="button"
		type="button"
		className={cn(
			"CardItem CardButton",
			cardItemVariants({ intent }),
			cardInteractiveItemVariants({ isSelected, intent }),
			className
		)}
		{...props}
		aria-disabled={props.disabled}
	/>
)
