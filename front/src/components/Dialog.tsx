import { DialogBackdrop, Dialog as DialogBase, DialogPanel } from "@headlessui/react"
import type { PropsWithClassName } from "react"

import { cn } from "@/utils/cn"

import { Button } from "./Button"
import { WithIcon } from "./WithIcon"


export type DialogProps = PropsWithClassName<{
	id?: string
	role?: "dialog" | "alertdialog"
	isOpen?: boolean
	close: (context?: unknown) => void
	containerClassName?: string
	children?: React.ReactNode | ((props: { close: (context?: unknown) => void }) => React.ReactNode)
}>

export const Dialog = ({ isOpen = true, close, children, containerClassName, className, ...props }: DialogProps) => {
	return (
		<DialogBase
			{...props}
			open={isOpen}
			onClose={close}
			className={cn("Dialog relative z-50", containerClassName)}
		>
			<DialogBackdrop
				transition
				className="fixed inset-0 bg-neutral-900/95 backdrop-blur-xl transition-opacity data-closed:opacity-0 data-enter:ease-out data-leave:duration-200 data-leave:ease-in cursor-pointer"
			/>

			<div className="pointer-events-none fixed inset-0 z-10 w-screen overflow-y-auto">
				<div className="flex min-h-full items-center justify-center p-5 md:p-6">
					<DialogPanel
						transition
						className={cn(
							"DialogPanel",
							"pointer-events-auto",
							"relative transform",
							"drop-shadow-xl",
							"transition",
							"data-closed:scale-90 data-closed:opacity-0 data-enter:ease-out",
							"data-leave:duration-200 data-leave:ease-in",
							"max-w-prose",
							className
						)}
					>
						<DialogChildren close={close} children={children} />
					</DialogPanel>
				</div>
			</div>

			<Button
				onClick={close}
				intent="text"
				isNarrow
				className="fixed right-4 top-4 text-white z-50"
			>
				<WithIcon before="x" className="sr-only">Fermer</WithIcon>
			</Button>
		</DialogBase>
	)
}

export const DialogChildren = ({ children, ...props }: Pick<DialogProps, "children" |"close">) => (
	typeof children === "function" ? children(props) : children
)
