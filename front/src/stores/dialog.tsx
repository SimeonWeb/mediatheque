import type { ComponentType, RefObject } from "react"
import { create } from "zustand"
import { transitionsAllSettled } from "@/utils/transitions"

export type DialogOpenConfigDefaultProps = DialogOpenProps

export type DialogRefProps = {
	ref: RefObject<HTMLElement | null>
}

export type DialogEvents = {
	onOpen?: () => void
	onClose?: (context?: unknown) => void
	onRemove?: (context?: unknown) => void
}

export type DialogOpenProps = {
	isOpen?: boolean
}

export type OpenDialogHandler = <P extends DialogOpenConfigDefaultProps = DialogOpenConfigDefaultProps>(
	component: ComponentType<P>,
	props: NoInfer<Omit<P, "isOpen" | "close">>,
	events?: DialogEvents
) => void

export type DialogConfig<P extends DialogOpenConfigDefaultProps = DialogOpenConfigDefaultProps> = DialogRefProps & {
	props: NoInfer<P>
	component: ComponentType<P>
	events: DialogEvents
}

export type DialogState<P extends DialogOpenConfigDefaultProps = DialogOpenConfigDefaultProps> = {
	dialogs: DialogConfig<P>[]
}

export type DialogActions = {
	open: OpenDialogHandler
	close: (context?: unknown) => void
	closeAll: (context?: unknown) => void
	remove: <P extends DialogOpenConfigDefaultProps = DialogOpenConfigDefaultProps>(context?: unknown, dialog?: DialogConfig<P>) => void
}

const defaultState: DialogState = {
	dialogs: [],
}

export const useDialog = create<DialogState & DialogActions>()(
	(set, get) => ({
		...defaultState,
		open: (component, props, events = {}) => {
			set(_dialogSetterAdd({
				// @ts-expect-error Problem with generic type definition
				component,
				props,
				events,
			}))
			events.onOpen?.()
		},
		close: context => {
			const currentDialog = get().dialogs[get().dialogs.length - 1]

			if (!currentDialog) {
				return
			}

			transitionsAllSettled(
				currentDialog.ref.current,
				() => get().remove(context)
			)

			set(_dialogSetterClose)
			currentDialog.events.onClose?.(context)
		},
		closeAll: context => {
			for (const dialog of get().dialogs) {
				transitionsAllSettled(
					dialog.ref.current,
					() => get().remove(context, dialog)
				)
			}

			set(_dialogSetterCloseAll)
			for (const dialog of get().dialogs) {
				dialog.events.onClose?.(context)
			}
		},
		remove: (context, dialog) => {
			const currentDialog = dialog || get().dialogs[get().dialogs.length - 1]

			if (!currentDialog) {
				return
			}

			const { onRemove } = currentDialog.events
			useDialog.setState(_dialogSetterRemove)
			onRemove?.(context)
		},
	}),
)

/**
 * Internal setter, do not use directly
 */
export const _dialogSetterAdd = ({ component, props, events }: DialogConfig) => ({ dialogs }: DialogState) => {
	return {
		dialogs: [
			...dialogs,
			{
				component,
				props: {
					...props,
					isOpen: false,
					close: useDialog.getState().close,
				},
				events,
				ref: { current: null },
			},
		],
	}
}

/**
 * Internal setter, do not use directly
 */
export const _dialogSetterOpen = (ref: DialogRefProps["ref"]) => ({ dialogs }: DialogState) => {
	return {
		dialogs: dialogs.map((dialog, index) => (
			index === dialogs.length - 1
				? {
					...dialog,
					props: {
						...dialog.props,
						isOpen: true,
					},
					ref,
				}
				: dialog
		)),
	}
}

/**
 * Internal setter, do not use directly
 */
export const _dialogSetterClose = ({ dialogs }: DialogState) => {
	const newDialogs = [...dialogs]
	const dialog = newDialogs.pop()

	if (!dialog) {
		return { dialogs }
	}

	const dialogToClose = {
		...dialog,
		props: {
			...dialog.props,
			isOpen: false,
		},
	}

	return {
		dialogs: [
			...newDialogs,
			dialogToClose,
		],
	}
}

/**
 * Internal setter, do not use directly
*/
export const _dialogSetterRemove = ({ dialogs }: DialogState) => {
	const newDialogs = [...dialogs]
	const lastDialog = newDialogs.pop()

	if (!lastDialog) {
		return { dialogs }
	}

	return {
		dialogs: newDialogs,
	}
}


/**
 * Internal setter, do not use directly
 */
export const _dialogSetterCloseAll = ({ dialogs }: DialogState) => ({
	dialogs: dialogs.map(dialog => ({
		...dialog,
		props: {
			...dialog.props,
			isOpen: false,
		},
	})),
})
