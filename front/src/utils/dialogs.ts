import type { DefaultError } from "@tanstack/react-query"
import type { ReactNode } from "react"

import { AsyncConfirm, type AsyncConfirmProps, Confirm, type ConfirmProps, Dialog, type DialogProps, Preview, type PreviewProps } from "@/layouts/Dialogs"
import { type DialogEvents, useDialog } from "@/stores/dialog"
// import { Drawer, type DrawerProps } from "@/components/Drawer"

// import { cn } from "./cn"

export const openDialog = (
	title: ReactNode,
	children?: DialogProps["children"],
	props?: Omit<DialogProps, "title" | "children" | "isOpen" | "close">,
	events?: DialogEvents
) => {
	useDialog.getState().open(
		Dialog,
		{
			title,
			children,
			...props,
		},
		events
	)
}

export const openConfirm = (
	title: ReactNode,
	onConfirm: ConfirmProps["onConfirm"],
	children?: ConfirmProps["children"],
	props?: Omit<ConfirmProps, "title" | "children" | "onConfirm" | "isOpen" | "close">,
	events?: DialogEvents
) => {
	useDialog.getState().open(
		Confirm,
		{
			title,
			onConfirm,
			children,
			...props,
		},
		events
	)
}

export const openAsyncConfirm = <TData = unknown, TError = DefaultError, TVariables = void, TOnMutateResult = unknown>(
	title: ReactNode,
	mutationOptions: AsyncConfirmProps<TData, TError, TVariables, TOnMutateResult>["mutationOptions"],
	data?: AsyncConfirmProps<TData, TError, TVariables, TOnMutateResult>["data"],
	children?: AsyncConfirmProps<TData, TError, TVariables, TOnMutateResult>["children"],
	props?: Omit<AsyncConfirmProps<TData, TError, TVariables, TOnMutateResult>, "title" | "children" | "mutationOptions" | "data" | "isOpen" | "close">,
	events?: DialogEvents
) => {
	useDialog.getState().open(
		AsyncConfirm<TData, TError, TVariables, TOnMutateResult>,
		{
			title,
			mutationOptions,
			data,
			children,
			...props,
		},
		events
	)
}

export const openPreview = (
	index: number,
	props?: Omit<PreviewProps, "children" | "isOpen" | "close" | "index" | "files">,
	events?: DialogEvents
) => {
	useDialog.getState().open(
		Preview,
		{
			index,
			...props,
		},
		events
	)
}

// export const openDrawer = (
// 	children?: DrawerProps["children"],
// 	props?: Omit<DrawerProps, "children" | "isOpen" | "close">,
// 	events?: DialogEvents
// ) => {
// 	useDialog.getState().open(
// 		Drawer,
// 		{
// 			children,
// 			...props,
// 			className: cn("md:w-[calc(var(--sidebar-width)*1.5+var(--spacing)*3)]", props?.className),
// 		},
// 		events
// 	)
// }

// export const openDrawerInfo = (
// 	children?: DrawerProps["children"],
// 	props?: Omit<DrawerProps, "children" | "isOpen" | "close">,
// 	events?: DialogEvents
// ) => {
// 	useDialog.getState().open(
// 		Drawer,
// 		{
// 			children,
// 			...props,
// 			className: cn("md:w-(--sidebar-width)", props?.className),
// 		},
// 		events
// 	)
// }
