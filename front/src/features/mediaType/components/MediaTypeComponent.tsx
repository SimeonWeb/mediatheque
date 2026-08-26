import { useEffect, useMemo, useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useIntersectionObserver } from "usehooks-ts"
import { useParams } from "@tanstack/react-router"

import { Listbox } from "@/components/Listbox"
import { Loader } from "@/components/Loader"
import { MediaGrid } from "@/components/MediaGrid"
import { WithIcon } from "@/components/WithIcon"
import { cn } from "@/utils/cn"
import { defaultItemsPerPage } from "@/utils/pagination"
import { getMediaFiles } from "@/features/mediaFile/api/fetch"
import { uploadersQueryOptions } from "@/features/uploader/api/options"
import { useMediaFilesContext } from "@/features/mediaFile/utils/useMediaFiles"

import { getMediaTypeDefautLabel } from "../utils/labels"

export const MediaTypeComponent = () => {
	const type = useParams({
		from: "/$mediaType",
		select: params => params.mediaType,
	})
	const { isIntersecting, ref } = useIntersectionObserver({
		threshold: 0.25,
	})

	const [uploader, setUploader] = useState<string | undefined>()
	const [isOnLastItem, setIsOnLastItem] = useState<boolean>(false)

	const {
		data: dataUploaders,
		isLoading: isLoadingUploaders,
	} = useQuery(uploadersQueryOptions())
	const {
		data,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useInfiniteQuery({
		queryKey: [
			"getMediaFiles",
			{
				type,
				uploader,
			},
		],
		queryFn: ({ pageParam }) => getMediaFiles({
			page: pageParam,
			itemsPerPage: defaultItemsPerPage,
			"sort[createdAt]": "ASC",
			type,
			uploader,
		}),
		initialPageParam: 1,
		getNextPageParam: lastPage => (
			lastPage.pagination.nextPage ?? undefined
		),
	})

	useEffect(
		() => {
			if (!isOnLastItem && !isIntersecting || isLoading || !hasNextPage || isFetching) {
				return
			}

			fetchNextPage()
		},
		[isLoading, isOnLastItem, isIntersecting, hasNextPage, isFetching, fetchNextPage]
	)

	const { setFiles } = useMediaFilesContext()

	const items = useMemo(
		() => {
			const items = data?.pages.flatMap(page => page.items)

			setFiles(items || [])

			return items
		},
		[data, setFiles]
	)

	if (isLoading || isLoadingUploaders) {
		return <Loader />
	}

	const defaultLabel = getMediaTypeDefautLabel(type)

	return (
		<>
			<MediaGrid
				items={items}
				onItem={(_, __, isLast) => setIsOnLastItem(isLast)}
			/>
			<div
				ref={ref}
				className="h-screen mt-[-100vh] pointer-events-none"
			/>
			<Listbox
				containerClassName={cn(
					"fixed bottom-20 is-vertical:inset-x-4 w-auto z-50 is-horizontal:bottom-[2.5vw] is-horizontal:right-[calc(2.5vw+var(--spacing)*4)] is-horizontal:w-80",
					"starting:opacity-0 starting:translate-y-4 transition duration-800 delay-800"
				)}
				options={[
					{
						value: "",
						label: defaultLabel,
					},
					...dataUploaders!.items.flatMap(({ name, slug, total }) => (
						total > 0
							? [{
								value: slug,
								label: <WithIcon before="user" containerClassName="justify-start">{name}</WithIcon>,
							}]
							: []
					)),
				]}
				onSelected={option => setUploader(option?.value || undefined)}
				value={uploader}
				placeholder={defaultLabel}
				isClearable
			/>
		</>
	)
}
