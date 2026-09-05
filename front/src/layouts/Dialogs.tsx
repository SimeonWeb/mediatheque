import { type CSSProperties, type ReactNode, useCallback, useEffect, useReducer, useState } from "react"
import { type DefaultError, type MutationOptions, useMutation } from "@tanstack/react-query"

import { Card, CardItem } from "@/components/Card"
import { Dialog as DialogBase, type DialogProps as DialogBaseProps, DialogChildren } from "@/components/Dialog"
import { defaultCloseLabel, defaultConfirmLabel, defaultErrorMessage, defaultUndoLabel } from "@/utils/default"
import { Alert } from "@/components/Alert"
import { Button } from "@/components/Button"
import { DialogTitle } from "@headlessui/react"
import { Group } from "@/components/Group"
import { Heading } from "@/components/Heading"
import type { MediaFile } from "@/features/mediaFile/api/types"
import { PreviewItem } from "@/components/PreviewItem"
import { WithLoading } from "@/components/WithLoading"
import { cn } from "@/utils/cn"
import { sleep } from "@/utils/sleep"
import { useCardinalNavigation } from "@/utils/useCardinalNavigation"
import { useFiles } from "@/features/mediaFile/utils/store"
import { isPlaylist } from "@/features/mediaFile/utils/helpers"

export interface DialogProps extends DialogBaseProps {
	title: ReactNode
	button?: ReactNode
}

export const Dialog = ({ title, button = defaultCloseLabel, children, ...props }: DialogProps) => {
	return (
		<DialogBase {...props}>
			<Card className="text-sm">
				<CardItem isIso className="flex flex-col gap-4 md:gap-4 text-center max-w-sm">
					<DialogTitle as={Heading} like="h6">
						{title}
					</DialogTitle>
					<DialogChildren close={props.close} children={children} />
				</CardItem>
				<Group isNarrow size="px" className="bg-primary-1">
					<Button
						onClick={props.close}
						intent="text"
						className="bg-primary-3 flex-1 rounded-none"
					>
						{button}
					</Button>
				</Group>
			</Card>
		</DialogBase>
	)
}

export interface ConfirmProps extends DialogBaseProps {
	title: ReactNode
	confirm?: ReactNode
	undo?: ReactNode
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onConfirm: (data?: any) => (Promise<void> | void)
}

export const Confirm = ({
	title,
	confirm = defaultConfirmLabel,
	undo = defaultUndoLabel,
	onConfirm,
	children,
	role = "alertdialog",
	close,
	...props
}: ConfirmProps) => {
	const [state, dispatchState] = useReducer(
		(_, action) => ({
			status: action.status || "idle",
			error: action.status === "error" && action.error,
		}),
		{ status: "idle", error: undefined }
	)

	const handleClose = () => {
		if (state.status === "loading") {
			return
		}
		close()
	}

	return (
		<DialogBase
			role={role}
			{...props}
			close={handleClose}
		>
			<Card className="text-sm">
				<CardItem isIso className="flex flex-col gap-4 md:gap-4 text-center">
					<DialogTitle as={Heading} like="h6">
						{title}
					</DialogTitle>
					<DialogChildren close={handleClose} children={children} />
				</CardItem>
				{state.status === "error" && (
					<div className="w-full flex">
						<Alert title={defaultErrorMessage} className="rounded-none w-0 grow" />
					</div>
				)}
				<Group isNarrow size="px" className="bg-primary-1">
					<Button
						onClick={handleClose}
						intent="text"
						className="bg-primary-3 flex-1 rounded-none"
						readOnly={state.status === "loading" || state.status === "success"}
					>
						{undo}
					</Button>
					<Button
						onClick={async () => {
							dispatchState({ status: "loading" })

							try {
								await onConfirm()

								dispatchState({ status: "success" })
								await sleep(500)
								close(true)

							} catch (error) {
								dispatchState({ status: "error", error })
							}
						}}
						intent="text"
						className="bg-primary-3 flex-1 rounded-none"
						readOnly={state.status === "loading" || state.status === "success"}
					>
						<WithLoading isLoading={state.status === "loading"} isSuccess={state.status === "success"}>
							{confirm}
						</WithLoading>
					</Button>
				</Group>
			</Card>
		</DialogBase>
	)
}

export interface AsyncConfirmProps<
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TOnMutateResult = unknown,
> extends DialogBaseProps {
	title: ReactNode
	confirm?: ReactNode
	undo?: ReactNode
	mutationOptions: MutationOptions<TData, TError, TVariables, TOnMutateResult>
	data?: NoInfer<TVariables>
}

export const AsyncConfirm = <
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TOnMutateResult = unknown,
>({
	title,
	confirm = defaultConfirmLabel,
	undo = defaultUndoLabel,
	mutationOptions,
	data,
	children,
	role = "alertdialog",
	close,
	...props
}: AsyncConfirmProps<TData, TError, TVariables, TOnMutateResult>) => {
	const { mutate, isPending, isSuccess, error } = useMutation(mutationOptions)

	const handleClose = () => {
		if (isPending) {
			return
		}
		close()
	}

	return (
		<DialogBase
			role={role}
			{...props}
			close={handleClose}
		>
			<Card className="text-sm">
				<CardItem isIso className="flex flex-col gap-4 md:gap-4 text-center">
					<DialogTitle as={Heading} like="h6">
						{title}
					</DialogTitle>
					<DialogChildren close={handleClose} children={children} />
				</CardItem>
				{error && (
					<div className="w-full flex">
						<Alert className="rounded-none w-0 grow">
							{error instanceof Error ? error.message : defaultErrorMessage}
						</Alert>
					</div>
				)}
				<Group isNarrow size="px" className="bg-primary-1">
					<Button
						onClick={handleClose}
						intent="text"
						className="bg-primary-3 flex-1 rounded-none"
						readOnly={isPending || isSuccess}
					>
						{undo}
					</Button>
					<Button
						onClick={() => {
							mutate(
								data!,
								{
									onSuccess: async () => {
										await sleep(500)
										close(true)
									},
								}
							)
						}}
						intent="text"
						className="bg-primary-3 flex-1 rounded-none"
						readOnly={isPending || isSuccess}
					>
						<WithLoading isLoading={isPending} isSuccess={isSuccess}>
							{confirm}
						</WithLoading>
					</Button>
				</Group>
			</Card>
		</DialogBase>
	)
}

export interface PreviewProps extends DialogBaseProps {
	index: number
	onItem?: (item: MediaFile, index: number, isLast: boolean) => void
}

export const Preview = ({ index, onItem, ...props }: PreviewProps) => {
	const files = useFiles(state => state.items)

	const [currentIndex, setCurrentIndex] = useState(index)
	const [style, setStyle] = useState<CSSProperties>()

	const handleLeft = useCallback(
		() => {
			setCurrentIndex(currentIndex => {
				if (currentIndex === 0) {
					return currentIndex
				}

				return currentIndex - 1
			})
			setStyle(undefined)
		},
		[]
	)
	// const handleTouchMove = useCallback<TouchNavigationEvents["onTouchMove"]>(
	// 	x => {
	// 		setStyle({
	// 			translate: `${x}px 0px`,
	// 		})
	// 	},
	// 	[]
	// )
	const handleRight = useCallback(
		() => {
			setCurrentIndex(currentIndex => {
				if (currentIndex === files.length - 1) {
					return currentIndex
				}
				return currentIndex + 1
			})
			setStyle(undefined)
		},
		[files]
	)
	const handleSwipeClose = useCallback(
		() => {
			if (isPlaylist(files[currentIndex])) {
				return
			}

			props.close()
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentIndex]
	)

	useCardinalNavigation({
		onLeft: handleLeft,
		onRight: handleRight,
		// onTouchMove: handleTouchMove,
		onSwipeBottom: handleSwipeClose,
	})

	useEffect(
		() => {
			onItem?.(files[currentIndex], currentIndex, currentIndex === files.length - 1)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentIndex]
	)

	const currentFile = files[currentIndex]

	return (
		<DialogBase
			{...props}
			className={cn(
				"pointer-events-none w-full h-full",
				props.className
			)}
		>
			<PreviewItem
				item={currentFile}
				style={style}
				navigationEvents={{
					onPrevious: currentIndex > 0
						? handleLeft
						: undefined,
					onNext: currentIndex < files.length - 1
						? handleRight
						: undefined,
				}}
			/>
		</DialogBase>
	)
}
