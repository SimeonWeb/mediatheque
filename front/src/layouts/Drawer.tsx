import type { ComponentProps, ReactNode } from "react"

import { Button } from "@/components/Button"
import { DialogTitle } from "@headlessui/react"
import { Group } from "@/components/Group"
import { Heading } from "@/components/Heading"
import { WithIcon } from "@/components/WithIcon"
import { cn } from "@/utils/cn"
import { useDialog } from "@/stores/dialog"

export type DrawerHeaderProps = {
	title: ReactNode
	actions?: ReactNode
	close?: () => void
}

export const DrawerHeader = ({
	title,
	actions,
	close,
}: DrawerHeaderProps) => (
	<header
		className={cn(
			"DrawerHeader",
		)}
	>
		<Group size="base" className="items-center py-3 px-6 sm:py-6 sm:px-10">
			<DialogTitle as={Heading} like="h2" className="DialogTitle grow">
				{title}
			</DialogTitle>
			<Group size="base">
				{actions}
			</Group>
			<Button
				type="button"
				intent="text"
				isNarrow
				onClick={close || useDialog.getState().close}
			>
				<WithIcon before="x" className="sr-only">
					Fermer
				</WithIcon>
			</Button>
		</Group>
	</header>
)

export type DrawerMainProps = ComponentProps<"div">

export const DrawerMain = ({ children, className }: DrawerMainProps) => (
	<div
		className={cn(
			"DrawerMain",
			"@container/DrawerMain",
			"flex flex-col grow gap-4 sm:gap-6 py-3 px-6 sm:py-6 sm:px-10",
			"[.DrawerHeader+&]:pt-0",
			className
		)}
	>
		{children}
	</div>
)
