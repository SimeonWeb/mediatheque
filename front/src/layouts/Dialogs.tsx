import { type DefaultError, type MutationOptions, useMutation } from "@tanstack/react-query"
import { type ReactNode, useEffect, useReducer, useState } from "react"

import { Card, CardItem } from "@/components/Card"
import { Dialog as DialogBase, type DialogProps as DialogBaseProps, DialogChildren } from "@/components/Dialog"
import { defaultCloseLabel, defaultConfirmLabel, defaultErrorMessage, defaultUndoLabel } from "@/utils/default"
import { Alert } from "@/components/Alert"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { DialogTitle } from "@headlessui/react"
import { Group } from "@/components/Group"
import { Heading } from "@/components/Heading"
import { Icon } from "@/components/Icon"
import type { MediaFile } from "@/features/mediaFile/api/types"
import { WithIcon } from "@/components/WithIcon"
import { WithLoading } from "@/components/WithLoading"
import { cn } from "@/utils/cn"
import { getFileUrl } from "@/utils/file"
import { sleep } from "@/utils/sleep"
import { useMediaFilesContext } from "@/features/mediaFile/utils/useMediaFiles"

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
	const { files } = useMediaFilesContext()

	const [currentIndex, setCurrentIndex] = useState(index)

	const {
		paths,
		originalName,
		mimeType,
		extension,
	} = files[currentIndex]

	useEffect(
		() => {
			const handleKeydown = ({ key }: KeyboardEvent) => {
				switch (key) {
					case "ArrowLeft":
						setCurrentIndex(currentIndex => {
							if (currentIndex === 0) {
								return currentIndex
							}

							return currentIndex - 1
						})
						break
					case "ArrowRight":
						setCurrentIndex(currentIndex => {
							if (currentIndex === files.length - 1) {
								return currentIndex
							}
							return currentIndex + 1
						})
						break
				}
			}

			document.addEventListener("keydown", handleKeydown)

			return () => {
				document.removeEventListener("keydown", handleKeydown)
			}
		},
		[files]
	)

	useEffect(
		() => {
			onItem?.(files[currentIndex], currentIndex, currentIndex === files.length - 1)
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentIndex]
	)

	return (
		<DialogBase {...props} className={cn("max-w-none w-full", props.className)}>
			<DialogTitle as={Group} className="flex-col items-center justify-center">
				<button
					type="button"
					className="flex focusable rounded cursor-pointer max-w-[calc(95vw)] max-h-[calc(100vh-5vw)]"
					onClick={props.close}
					aria-label={defaultCloseLabel}
				>
					{mimeType.startsWith("image/")
						? (
							<img
								src={getFileUrl(paths.medium)}
								srcSet={`${getFileUrl(paths.medium)} 1080w, ${getFileUrl(paths.full)} 1920w`}
								alt={originalName}
								className="w-full h-full object-contain rounded"
							/>
						)
						: (
							<div className="flex flex-col gap-4 items-center justify-center text-primary">
								<div className="size-20 grid col-span-1 row-span-1 justify-center items-center">
									<Icon name="document" className="col-start-1 row-start-1 size-full" />
									<span className="col-start-1 row-start-1 text-white/80 text-base pt-5 uppercase">{extension}</span>
								</div>
								<Badge>{originalName}</Badge>
							</div>
						)
					}
				</button>
			</DialogTitle>
			{currentIndex > -1 && !!files && (
				<>
					<button
						onClick={() => {
							setCurrentIndex(currentIndex - 1)
						}}
						className={cn(
							"flex items-center justify-start p-[2.5vw]",
							"absolute inset-0 right-3/4 z-50",
							"cursor-left",
							{
								"hidden": currentIndex === 0,
							}
						)}
					>
						<WithIcon before="chevron-left" containerClassName="is-horizontal:sr-only grow-0 text-white text-shadow-2xl" className="sr-only">
							Précédent
						</WithIcon>
					</button>
					<button
						onClick={() => {
							setCurrentIndex(currentIndex + 1)
						}}
						aria-label="Suivant"
						className={cn(
							"flex items-center justify-end p-[2.5vw]",
							"absolute inset-0 left-3/4 z-50",
							"cursor-right",
							{
								"hidden": currentIndex === files.length - 1,
							}
						)}
					>
						<WithIcon before="chevron-right" containerClassName="is-horizontal:sr-only grow-0 text-white text-shadow-2xl" className="sr-only">
							Suivant
						</WithIcon>
					</button>
				</>
			)}
		</DialogBase>
	)
}
