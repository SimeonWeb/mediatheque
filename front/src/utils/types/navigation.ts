import type { ComponentProps } from "react"
import type { LinkProps } from "@tanstack/react-router"

import type { ButtonProps, LinkButtonProps } from "@/components/Button"

// import type { Icons } from "./icons"
import type { NavigationElementVariant } from "../navigation"

export type NavigationElementWithCondition<
	E extends NavigationElement | PrimaryNavigationElement = NavigationElement,
> = E & { condition?: boolean | (() => boolean) }

export type NavigationElementWithDisabled<
	E extends NavigationElement | PrimaryNavigationElement = NavigationElement,
> = E & { disabled?: boolean }

export type NavigationElementButtonProps = NavigationElementWithCondition<
	Omit<ComponentProps<"button">, "type">
	& {
		type: NonNullable<ComponentProps<"button">["type"]>
		"data-selected"?: boolean
	}
	& LinkProps
	& NavigationElementVariant
>

export type NavigationElementLinkProps = NavigationElementWithCondition<
	ComponentProps<"a">
	& LinkProps
	& NavigationElementVariant
>

export type NavigationElementExternalLinkProps = NavigationElementWithCondition<
	ComponentProps<"a">
	& LinkProps
	& { to?: never }
	& NavigationElementVariant
>

export type NavigationElementSectionProps = NavigationElementWithCondition<NavigationElementWithDisabled<
	ComponentProps<"div">
	& {
		type: "section"
		label: string
		items: NavigationElementWithCondition<NavigationElementWithDisabled<NavigationElementInteractive | NavigationElementCustom>>[]
	}
>>

export type NavigationElementSeparatorProps = NavigationElementWithCondition<NavigationElementWithDisabled<
	ComponentProps<"div">
	& {
		type: "separator"
	}
>>

// Duplicated from @headlessui/react/dist/components/menu/menu.d.ts
export type ItemRenderPropArg = {
	focus: boolean
	disabled: boolean;
	close: () => void
}

export type NavigationElementCustom = NavigationElementWithCondition<NavigationElementWithDisabled<{
	type: "custom"
	component: React.FC<ItemRenderPropArg>
	children?: never
}>>

export type PrimaryNavigationElement = NavigationElementWithCondition<
	(
		ButtonProps
		| LinkButtonProps
	)
	// & {
	// 	icon?: Icons
	// }
>

export type NavigationElementInteractive = (
	NavigationElementButtonProps
	| NavigationElementLinkProps
	| NavigationElementExternalLinkProps
)

export type NavigationElement = (
	NavigationElementInteractive
	| NavigationElementSectionProps
	| NavigationElementSeparatorProps
	| NavigationElementCustom
)

export type ContextualNavigationMethod<E> = (entity: E) => NavigationElement[]
