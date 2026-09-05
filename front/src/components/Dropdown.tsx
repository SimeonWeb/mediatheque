import { Menu, MenuButton, MenuHeading, MenuItem, MenuItems, MenuSection, MenuSeparator } from "@headlessui/react"
import React, { type ComponentType } from "react"
import { Link } from "@tanstack/react-router"

import {
	type Align,
	type Placement,
	extractLinkProps,
	isNavigationElementButton,
	isNavigationElementCustom,
	isNavigationElementExternalLink,
	isNavigationElementSection,
	isNavigationElementSeparator,
	navigationElementVariant,
} from "@/utils/navigation"
import type { NavigationElement, NavigationElementButtonProps, NavigationElementExternalLinkProps } from "@/utils/types/navigation"
import { cn } from "@/utils/cn"
import { router } from "@/utils/router"

import { Button, type ButtonProps } from "./Button"
import { WithIcon } from "./WithIcon"

export interface DropdownProps extends ButtonProps {
	items: NavigationElement[]
	showIcon?: boolean
	anchor?: Placement | `${Placement} ${Align}`
	menuClassName?: string
	buttonComponent?: ComponentType<ButtonProps>
}

const ButtonItem = ({ children, ...props }: NavigationElementButtonProps) => {
	const [
		linkProps,
		buttonProps,
	] = extractLinkProps(props)

	return (
		<button
			onClick={() => {
				router.navigate(linkProps)
			}}
			{...buttonProps}
		>
			{typeof children === "function"
				? children({ isActive: false, isTransitioning: false })
				: children
			}
		</button>
	)
}

const ExternalLinkButtonItem = ({ children, ...props }: NavigationElementExternalLinkProps) => (
	<a {...props}>
		{typeof children === "function"
			? children({ isActive: false, isTransitioning: false })
			: children
		}
	</a>
)

export const Dropdown = ({
	children,
	items,
	intent = "secondary",
	anchor = "bottom start",
	showIcon = true,
	menuClassName,
	buttonComponent: ButtonComponent = Button,
	...props
}: DropdownProps) => !!items && (
	<Menu>
		<MenuButton as={React.Fragment}>
			{({ active }) => (
				<ButtonComponent
					intent={intent}
					data-active={active}
					{...props}
				>
					{showIcon
						? (
							<WithIcon after="menu">
								{children}
							</WithIcon>
						)
						: children
					}
				</ButtonComponent>
			)}
		</MenuButton>
		<MenuItems
			transition
			anchor={{ to: anchor, gap: 4 }}
			modal={false}
			className={cn(
				"flex flex-col gap-px",
				"rounded-lg outline-none",
				"bg-primary-1",
				"data-closed:translate-y-4 data-closed:opacity-0",
				"ring ring-primary-1 shadow-[0_0_3em_.5em_var(--tw-shadow-color)] shadow-primary-1",
				"transition",
				"z-40",
				menuClassName,
			)}
		>
			{items.map((item, index) => {
				if (isNavigationElementSection(item)) {
					return (
						<MenuSection
							key={index}
							className="MenuSection flex flex-col gap-1 pt-[.2em] not-first:pt-[.4em]"
						>
							<MenuHeading className="MenuHeading text-sm font-semibold text-neutral-base px-[1.2em]">
								{item.label}
							</MenuHeading>
							<div className="flex flex-col gap-px">
								{item.items.map((sectionItem, index) => (
									<MenuItem key={index} disabled={sectionItem.disabled}>
										{props => (
											isNavigationElementSeparator(sectionItem)
												? <MenuSeparator className="MenuSeparator h-0.5 data-focus:bg-primary rounded-full" />
												: isNavigationElementCustom(sectionItem)
													? <sectionItem.component {...props} />
													: isNavigationElementExternalLink(sectionItem)
														? <ExternalLinkButtonItem {...sectionItem} className={cn(navigationElementVariant({ intent: sectionItem.intent }), sectionItem.className)} />
														: isNavigationElementButton(sectionItem)
															? <ButtonItem {...sectionItem} className={cn(navigationElementVariant({ intent: sectionItem.intent }), sectionItem.className)} />
															: <Link {...sectionItem} className={cn(navigationElementVariant({ intent: sectionItem.intent }), sectionItem.className)} />
										)}
									</MenuItem>
								))}
							</div>
						</MenuSection>
					)
				}

				return (
					<MenuItem key={index} disabled={item.disabled}>
						{props => (
							isNavigationElementSeparator(item)
								? <MenuSeparator className="MenuSeparator h-0.5 data-focus:bg-primary rounded-full" />
								: isNavigationElementCustom(item)
									? <item.component {...props} />
									: isNavigationElementExternalLink(item)
										? <ExternalLinkButtonItem {...item} className={cn(navigationElementVariant({ intent: item.intent }), item.className)} />
										: isNavigationElementButton(item)
											? <ButtonItem {...item} className={cn(navigationElementVariant({ intent: item.intent }), item.className)} />
											: <Link {...item} className={cn(navigationElementVariant({ intent: item.intent }), item.className)} />
						)}
					</MenuItem>
				)
			})}
		</MenuItems>
	</Menu>
)
