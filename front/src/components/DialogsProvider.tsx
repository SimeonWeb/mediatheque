import { useEffect, useRef } from "react"

import { type DialogConfig, type DialogOpenConfigDefaultProps, _dialogSetterOpen, useDialog } from "@/stores/dialog"


export const DialogsProvider = () => {
	const dialogs = useDialog(state => state.dialogs)

	return dialogs.map((props, index) => (
		<DialogWrapper key={index} index={index} {...props} />
	))
}

const DialogWrapper = <P extends DialogOpenConfigDefaultProps = DialogOpenConfigDefaultProps>({
	component: Component,
	props,
}: DialogConfig<P> & { index: number }) => {
	const componentRef = useRef<HTMLElement>(null)

	/**
	 * Due to headlessui managment of css transition
	 * we must wait for first render to trigger open transition
	 */
	useEffect(
		() => {
			useDialog.setState(_dialogSetterOpen(componentRef))
		},
		[]
	)

	return (
		<Component
			{...props}
			ref={componentRef}
		/>
	)
}
