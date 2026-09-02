import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react"
import { type PropsWithClassName } from "react"

import { cn } from "@/utils/cn"

import { DialogChildren } from "./Dialog"

export type DrawerProps = PropsWithClassName<{
	id?: string
	role?: "dialog" | "alertdialog"
	isOpen?: boolean
	close: () => void
	children?: React.ReactNode | ((props: { close: () => void }) => React.ReactNode)
	containerClassName?: string
}>

export const Drawer = ({ isOpen = true, close, children, containerClassName, className, ...props }: DrawerProps) => {
	return (
		<Dialog
			{...props}
			open={isOpen}
			onClose={close}
			className={cn(
				"Dialog Drawer relative z-40",
				containerClassName,
			)}
		>
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-neutral-200/90 is-horizontal:bg-white/80 backdrop-blur-xl transition-opacity data-closed:opacity-0 data-enter:ease-out data-leave:duration-200 data-leave:ease-in cursor-pointer"
			>
			</DialogBackdrop>

			<div className="pointer-events-none fixed inset-0 overflow-hidden">
				<div className="fixed inset-0 top-8 bottom-0 is-horizontal:inset-x-[2.5vw] is-horizontal:top-[5vw] flex justify-center max-w-full">
					<DialogPanel
						transition
						className={cn(
							"DialogPanel",
							"pointer-events-auto",
							"w-screen max-h-full max-w-6xl",
							"transform transition duration-500 ease-in-out",
							"data-closed:translate-y-full",
							className
						)}
					>
						<div
							className={cn(
								"DrawerOverflowContainer",
								"relative flex h-full flex-col",
								"overflow-y-auto",
								"bg-white shadow-2xl",
								"rounded-t-xl lg:rounded-t-4xl",
								"transition-opacity duration-500 data-closed:opacity-0",
							)}
						>
							<DialogChildren close={close} children={children} />
						</div>
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	)
}
