import { type VariantProps, cva } from "class-variance-authority"
import type { LinkProps } from "@tanstack/react-router"

import type {
	NavigationElement,
	NavigationElementButtonProps,
	NavigationElementCustom,
	NavigationElementExternalLinkProps,
	NavigationElementLinkProps,
	NavigationElementSectionProps,
	NavigationElementSeparatorProps,
	PrimaryNavigationElement,
} from "./types/navigation"
import { cn } from "./cn"

// Duplicated from @headlessui/react/dist/internal/floating.d.ts
export type Align = "start" | "end"
export type Placement = "top" | "right" | "bottom" | "left"

export const navigationElementBaseClassName = cn(
	"NavigationElement",
	"flex justify-start",
	"[&_.WithIcon>span]:grow",
	"text-left",
	"text-sm leading-tight",
	"px-[1.2em] py-[.947em]",
	"rounded-3xl",
	"ring-2 ring-inset ring-transparent",
	"has-[+.MenuSeparator]:rounded-b-lg [.MenuSeparator+&]:rounded-t-lg",
	"transition",
	"outline-none",
	"aria-disabled:not-aria-readonly:opacity-50",
)

export const navigationElementVariant = cva(
	[
		navigationElementBaseClassName,
		"not-aria-readonly:cursor-pointer aria-disabled:not-aria-readonly:cursor-not-allowed aria-selected:cursor-default",
	],
	{
		variants: {
			intent: {
				default: [
					"select-none data-focus:bg-primary data-focus:text-white data-focus:outline-hidden",
				],
				primary: [
					"hover:not-aria-disabled:not-aria-readonly:bg-primary/80 aria-selected:bg-primary/80 aria-checked:bg-primary/80",
					"focus-visible:bg-primary data-focus:bg-primary",
					"hover:not-aria-disabled:not-aria-readonly:text-white aria-selected:text-white aria-checked:text-white",
					"focus-visible:text-white data-focus:text-white",
				],
				error: [
					"hover:not-aria-disabled:not-aria-readonly:bg-error/80 aria-selected:bg-error/80 aria-checked:bg-error/80",
					"focus-visible:bg-error data-focus:bg-error",
					"hover:not-aria-disabled:not-aria-readonly:text-white aria-selected:text-white aria-checked:text-white",
					"focus-visible:text-white data-focus:text-white",
				],
				warning: [
					"hover:not-aria-disabled:not-aria-readonly:bg-warning/80 aria-selected:bg-warning/80 aria-checked:bg-warning/80",
					"focus-visible:bg-warning data-focus:bg-warning",
					"hover:not-aria-disabled:not-aria-readonly:text-black aria-selected:text-black aria-checked:text-black",
					"focus-visible:text-black data-focus:text-black",
				],
				info: [
					"hover:not-aria-disabled:not-aria-readonly:bg-info/80 aria-selected:bg-info/80 aria-checked:bg-info/80",
					"focus-visible:bg-info data-focus:bg-info",
					"hover:not-aria-disabled:not-aria-readonly:text-black aria-selected:text-black aria-checked:text-black",
					"focus-visible:text-black data-focus:text-black",
				],
			},
		},
		defaultVariants: {
			intent: "default",
		},
	},
)

export type NavigationElementVariant = VariantProps<typeof navigationElementVariant>

export const isNavigationElementLink = (element: NavigationElement | PrimaryNavigationElement): element is NavigationElementLinkProps => (
	element.type === undefined && "to" in element
)

export const isNavigationElementButton = (element: NavigationElement | PrimaryNavigationElement): element is NavigationElementButtonProps => (
	element.type !== undefined && !isNavigationElementCustom(element)
)

export const isNavigationElementExternalLink = (element: NavigationElement | PrimaryNavigationElement): element is NavigationElementExternalLinkProps => (
	element.type === undefined && "href" in element && !!element.href
)

export const isNavigationElementSeparator = (element: NavigationElement | PrimaryNavigationElement): element is NavigationElementSeparatorProps => (
	element.type === "separator"
)

export const isNavigationElementSection = (element: NavigationElement | PrimaryNavigationElement): element is NavigationElementSectionProps => (
	element.type === "section"
)

export const isNavigationElementCustom = (element: NavigationElement | PrimaryNavigationElement): element is NavigationElementCustom => (
	element.type === "custom"
)

/**
 * @see useLinkProps in @tanstack/react-router/src/link.tsx:459
 */
export const extractLinkProps = (props: LinkProps): [LinkProps, object] => {

	const {
		activeProps,
		inactiveProps,
		activeOptions,
		to,
		from,
		preload,
		preloadDelay,
		hashScrollIntoView,
		replace,
		startTransition,
		resetScroll,
		viewTransition,
		params,
		search,
		hash,
		state,
		mask,
		reloadDocument,

		...otherProps
	} = props

	return [
		{
			activeProps,
			inactiveProps,
			activeOptions,
			to,
			from,
			preload,
			preloadDelay,
			hashScrollIntoView,
			replace,
			startTransition,
			resetScroll,
			viewTransition,
			params,
			search,
			hash,
			state,
			mask,
			reloadDocument,
		},
		otherProps,
	]
}

export const filterNavigationElements = <
	E extends NavigationElement | PrimaryNavigationElement = NavigationElement,
>(navigationElements: (E | undefined | null | false)[]) => (
	navigationElements.flatMap(element => {
		if (!element) {
			return []
		}

		const {
			condition,
			...navigationElement
		} = element

		const isVisible = typeof condition === "undefined" || (typeof condition === "function" ? condition() : condition)

		if (!isVisible) {
			return []
		}

		if (isNavigationElementSection(navigationElement)) {
			navigationElement.items = filterNavigationElements(navigationElement.items)
		}

		return [navigationElement]
	})
)

export const hasReferer = () => {
	const searchParams = new URLSearchParams(window.location.search)

	return searchParams.has("referer")
}

export const withReferer = (props: LinkProps) => {
	const searchParams = new URLSearchParams(window.location.search)

	const referer = searchParams.get("referer")

	if (referer) {
		return {
			...props,
			to: referer,
		} as LinkProps
	}

	return props
}
