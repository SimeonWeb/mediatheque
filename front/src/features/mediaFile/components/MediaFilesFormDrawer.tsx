import { type Batch, type BatchItem, ChunkedUploady, FILE_STATES, UPLOADER_EVENTS, useAbortAll, useAbortItem, useAllAbortListener, useBatchAddListener, useBatchFinishListener, useBatchProgressListener, useChunkStartListener, useItemAbortListener, useItemFinalizeListener, useUploady } from "@rpldy/chunked-uploady"
import { useEffect, useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { UploadDropZone } from "@rpldy/upload-drop-zone"
import { asUploadButton } from "@rpldy/upload-button"

import { Button, type ButtonProps } from "@/components/Button"
import { Card, CardButton, CardHeader, CardItem } from "@/components/Card"
import { DrawerHeader, DrawerMain } from "@/layouts/Drawer"
import { addUploaderDefaultValues, addUploaderSchema } from "@/features/uploader/schemas/uploader"
import { addUploaderOptions, uploadersQueryOptions } from "@/features/uploader/api/options"
import { getAllowedExtensions, getAllowedMimeTypes } from "@/features/mediaType/utils/helpers"
import { getBatchItemCount, toMediaGridItem } from "@/features/uploady/utils/helpers"
import { getFetchHeaders, getFetchUrl } from "@/utils/fetch"
import { getMediaTypePluralizedLabel, getMediaTypePluralizedNumberedLabel } from "@/features/mediaType/utils/labels"
import { Alert } from "@/components/Alert"
import { DrawerForm } from "@/layouts/DrawerForm"
import { FormSubmit } from "@/components/FormSubmit"
import { Group } from "@/components/Group"
import { Icon } from "@/components/Icon"
import { InputFormField } from "@/components/InputFormField"
import { Loader } from "@/components/Loader"
import { MediaGridContainer } from "@/components/MediaGrid"
import { MediaGridItem } from "@/components/MediaGridItem"
import type { UploaderItem } from "@/features/uploader/api/types"
import { WithIcon } from "@/components/WithIcon"
import { WithLoading } from "@/components/WithLoading"
import { cn } from "@/utils/cn"
import { defaultItemsPerPage } from "@/utils/pagination"
import { getPluralizedText } from "@/utils/text"
import { invalidateMediaTypeQueries } from "@/features/mediaType/api/fetch"
import { invalidateUploaderQueries } from "@/features/uploader/api/fetch"
import { uploaderEntityLabel } from "@/features/uploader/utils/labels"
import { useDialog } from "@/stores/dialog"

import { invalidateMediaFileQueries } from "../api/fetch"
import { sleep } from "@/utils/sleep"

const UploadButton = asUploadButton<ButtonProps>(props => (
	<Button intent="primary" autoFocus {...props} />
))

const UploadZone = () => (
	<UploadDropZone
		className={cn(
			"flex flex-col gap-1 justify-center items-center",
			"border-dashed border border-neutral-400 h-48 rounded-xl",
			"transition duration-500"
		)}
		onDragOverClassName="onDragOver"
	>
		<p>Déposez vos fichiers</p>
		<p className="text-xs mb-2">ou</p>
		<UploadButton>
			Sélectionnez des fichiers
		</UploadButton>
		<p className="text-xs mt-2 text-neutral-500">
			Formats autorisés : {getAllowedExtensions().join(", ")}
		</p>
	</UploadDropZone>
)

const UploadChunkParams = () => {
	useChunkStartListener(({ item, sendOptions }) => ({
		sendOptions: {
			...sendOptions,
			params: {
				...sendOptions.params,
				upload_id: item.id,
			},
		},
	}))

	return null
}

type PreviewMediaItemProps = {
	item: BatchItem
	index: number
}

const PreviewMediaItem = ({
	item,
	index,
}: PreviewMediaItemProps) => {
	const [itemState, setState] = useState(item.state)

	const abortItem = useAbortItem()

	useItemFinalizeListener(
		item => {
			setState(item.state)
		},
		item.id
	)

	console.log(item.id, itemState)

	const isPending = itemState === FILE_STATES.PENDING
	const isAborted = itemState === FILE_STATES.ABORTED
	const isUploading = itemState === FILE_STATES.UPLOADING
	const isSuccess = itemState === FILE_STATES.FINISHED
	const isError = itemState === FILE_STATES.ERROR

	const onAbortItem = () => {
		abortItem(item.id)
	}

	return !isAborted && (
		<div
			className={cn(
				"relative group rounded-md outline-offset-2 outline-transparent focus-within:outline-2 focus-within:outline-primary",
				"translate-0 starting:opacity-0 starting:translate-y-4",
				"transition duration-500"
			)}
			style={{
				transitionDelay: `${15 * (index % defaultItemsPerPage)}ms`,
			}}
		>
			<MediaGridItem {...toMediaGridItem(item)} />
			{isPending && (
				<div
					className="absolute right-1 top-1 sm:right-2 sm:top-2 flex justify-center items-center"
				>
					<Button
						onClick={onAbortItem}
						isNarrow
						size="sm"
						intent="error"
						className={cn(
							"sm:scale-70 sm:opacity-0",
							"group-focus-within:opacity-100 group-focus-within:scale-100",
							"group-hover:opacity-100 group-hover:scale-100",
							"transition delay-300"
						)}
					>
						<WithIcon before="x" className="sr-only">Supprimer</WithIcon>
					</Button>
				</div>
			)}
			{(isUploading || isSuccess || isError) && (
				<div
					className={cn(
						"absolute inset-0 bg-white/80 text-primary",
						"flex justify-center items-center",
						"text-xl",
						{
							"text-error": isError,
						}
					)}
				>
					{isUploading && <Loader />}
					{isSuccess && <Icon name="check" />}
					{isError && <Icon name="error" />}
				</div>
			)}
		</div>
	)
}

const PreviewZone = () => {
	const { processPending } = useUploady()
	const [items, setItems] = useState<BatchItem[]>([])

	const abortAll = useAbortAll()
	// Get current batch info
	const { completed, state, ...rest } = useBatchProgressListener() || { completed: 0 }

	console.log("batch", { completed, state, ...rest })

	useBatchAddListener(batch => {
		setItems(items => items.concat(batch.items))
	})

	useItemAbortListener(item => {
		setItems(items => items.filter(({ id }) => item.id !== id))
	})

	useAllAbortListener(() => {
		setItems([])
	})

	useBatchFinishListener(() => {
		invalidateMediaTypeQueries()
		invalidateUploaderQueries()
		invalidateMediaFileQueries()
	})

	const isLoading = state === "added" && completed > 0
	const isSuccess = state === "added" && completed === 100

	const totals = useMemo(
		() => (
			Object.entries(getBatchItemCount({ items })).flatMap(([type, total]) => (
				total > 0
					? [getMediaTypePluralizedNumberedLabel(total, type)]
					: []
			)).join(", ")
		),
		[items]
	)

	return (
		<Card
			isOutlined
			as="section"
			className={cn(
				"border border-neutral-200 rounded-xl",
				{
					"invisible": items.length === 0,
				}
			)}
		>
			<CardHeader>
				<Group className="items-center justify-between">
					<p>
						{totals}
					</p>
					<Button
						size="sm"
						isNarrow
						rounded={false}
						intent="error"
						className={cn(
							"text-neutral-800",
							"bg-neutral-200",
						)}
						onClick={abortAll}
					>
						Tout supprimer
					</Button>
				</Group>
			</CardHeader>
			<CardItem isIso>
				<MediaGridContainer>
					{items.map((item, index) => (
						<PreviewMediaItem
							key={item.id}
							item={item}
							index={index}
						/>
					))}
				</MediaGridContainer>
			</CardItem>
			<CardItem as="footer" isIso className="flex">
				<Button
					type="button"
					onClick={() => processPending()}
					disabled={items.length === 0}
					intent="primary"
					className="grow"
					readOnly={isLoading || isSuccess}
				>
					<WithLoading
						isLoading={isLoading}
						isSuccess={isSuccess}
					>
						<WithIcon after="chevron-right">
							Envoyer
						</WithIcon>
					</WithLoading>
				</Button>
			</CardItem>
		</Card>
	)
}

type ThanksZoneProps = {
	uploader: UploaderItem
	items: BatchItem[]
}

const ThanksZone = ({ uploader, items }: ThanksZoneProps) => {
	return (
		<Card isOutlined>
			<CardItem
				isIso
				className="flex p-8 gap-3 md:p-12 md:gap-6 flex-col items-center text-2xl font-handwriting"
			>
				<p
					className={cn(
						"w-full max-w-prose",
						"-rotate-1 translate-0 starting:opacity-0 starting:rotate-0 starting:-translate-y-2",
						"transition duration-500"
					)}
				>
					{`Merci ${
						uploader.name
					} pour ${
						getPluralizedText(items.length, "tes trop belles", "ta trop belle")
					} ${
						Object.entries(getBatchItemCount({ items })).flatMap(([type, total]) => (
							total > 0
								? [getMediaTypePluralizedLabel(items.length, type)]
								: []
						)).join(" et ")}`
					}
				</p>
				<p
					className={cn(
						"w-full max-w-prose",
						"pl-2 -rotate-2 translate-0 starting:opacity-0 starting:rotate-0 starting:-translate-y-2",
						"transition delay-250 duration-700"
					)}
				>
					On s'aime putain !!!
				</p>
				<p
					className="text-right w-full max-w-prose -mt-2 md:-mt-6"
				>
					<Icon
						name="ink-pad"
						label="Marie et Simon"
						className="size-40 text-primary starting:opacity-0 starting:-rotate-6 starting:scale-120 transition delay-1200 duration-400"
					/>
				</p>
			</CardItem>
			<CardItem as="footer" isIso className="flex">
				<Button
					type="button"
					onClick={() => useDialog.getState().close()}
					className="grow starting:opacity-0 transition delay-2300 duration-700"
				>
					Fermer
				</Button>
			</CardItem>
		</Card>
	)
}

const MediaFilesUploaderFormFields = () => (
	<>
		<InputFormField
			name="name"
		/>
		<FormSubmit icon="chevron-right">
			Continuer
		</FormSubmit>
	</>
)

export const MediaFilesFormDrawer = () => {
	const { data: dataUploaders } = useQuery(uploadersQueryOptions())

	const { mutateAsync, data, error, reset } = useMutation(addUploaderOptions())

	const [uploaderId, setUploaderId] = useState<string | undefined>()
	const [successBatch, setSuccessBatch] = useState<Batch | undefined>()

	const alreadyExists = error && error.message === "Ce nom est déjà utilisé."
	const existingUploaderId = alreadyExists && error.cause.data.uploaderId

	const uploader = dataUploaders?.items.find(({ id }) => uploaderId === id)

	useEffect(
		() => {
			/* eslint-disable react-hooks/set-state-in-effect */
			if (!data) {
				setUploaderId(undefined)

				return
			}

			setUploaderId(data.id)
			/* eslint-enable react-hooks/set-state-in-effect */
		},
		[data]
	)

	return (
		<>
			{uploader
				? (
					<>
						<DrawerHeader
							title="Ajouter des photos et vidéos"
						/>
						<DrawerMain>
							<Card isOutlined>
								<CardButton
									onClick={() => {
										reset()
										setUploaderId(undefined)
									}}
								>
									<WithIcon
										before="chevron-left"
										containerClassName="justify-start"
									>
										En tant que <strong>{uploader?.name}</strong>
									</WithIcon>
								</CardButton>
							</Card>
							{successBatch
								? <ThanksZone uploader={uploader} items={successBatch.items} />
								: (
									<ChunkedUploady
										autoUpload={false}
										retries={2}
										destination={{
											url: getFetchUrl("/media_files"),
											headers: getFetchHeaders(),
											params: { uploader_id: uploaderId },
										}}
										accept={getAllowedMimeTypes().join(",")}
										listeners={{
											[UPLOADER_EVENTS.BATCH_FINALIZE]: async batch => {
												if (batch.total > 0) {
													console.log("setSuccessBatch", batch)
													await sleep(500)
													setSuccessBatch(batch)
												}
											},
										}}
									>
										<UploadChunkParams />
										<UploadZone />
										<PreviewZone />
									</ChunkedUploady>
								)
							}
						</DrawerMain>
					</>
				)
				: (
					<DrawerForm
						title="Ajouter des photos et vidéos"
						schema={addUploaderSchema}
						defaultValues={addUploaderDefaultValues()}
						entityLabel={uploaderEntityLabel}
						onValid={data => mutateAsync(data)}
						error={!existingUploaderId ? error : undefined}
					>
						{existingUploaderId && (
							<Alert intent="warning">
								{error.message}
								<Button
									isNarrow
									intent="warning"
									rounded={false}
									onClick={() => setUploaderId(existingUploaderId)}
									autoFocus
								>
									<WithIcon after="chevron-right">
										Ajouter d'autres fichiers <span className="max-sm:sr-only">avec ce nom</span>
									</WithIcon>
								</Button>
							</Alert>
						)}
						<MediaFilesUploaderFormFields />
					</DrawerForm>
				)
			}
		</>
	)
}
