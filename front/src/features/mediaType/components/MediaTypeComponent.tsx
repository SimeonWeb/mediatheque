import { useEffect, useMemo, useState } from "react"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { useNavigate, useParams, useSearch } from "@tanstack/react-router"
import { useIntersectionObserver } from "usehooks-ts"

import { Listbox } from "@/components/Listbox"
import { Loader } from "@/components/Loader"
import { MediaGrid } from "@/components/MediaGrid"
import { WithIcon } from "@/components/WithIcon"
import { cn } from "@/utils/cn"
import { defaultItemsPerPage } from "@/utils/pagination"
import { getMediaFiles } from "@/features/mediaFile/api/fetch"
import { toMediaGridItem } from "@/features/mediaFile/utils/helpers"
import { uploadersQueryOptions } from "@/features/uploader/api/options"
import { useFiles } from "@/features/mediaFile/utils/store"

import { getMediaTypeDefautLabel } from "../utils/labels"

export const MediaTypeComponent = () => {
	const type = useParams({
		from: "/$mediaType",
		select: params => params.mediaType,
	})
	const uploader = useSearch({
		from: "/$mediaType",
		select: params => params.uploader,
	})
	const navigate = useNavigate({ from: "/$mediaType" })

	const { isIntersecting, ref } = useIntersectionObserver({
		threshold: 0.25,
	})

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

	const items = useMemo(
		() => {
			const items = data?.pages.flatMap(page => page.items) || []

			useFiles.setState({ items })

			return items.map(toMediaGridItem)
		},
		[data]
	)

	if (isLoading || isLoadingUploaders) {
		return <Loader />
	}

	const defaultLabel = getMediaTypeDefautLabel(type)

	return (
		<>
			<MediaGrid
				className="p-1 is-horizontal:p-[2.5vw] is-horizontal:pl-0"
				items={items}
				onItem={(_, __, isLast) => setIsOnLastItem(isLast)}
			/>
			<div
				ref={ref}
				className="h-screen mt-[-100vh] pointer-events-none"
			/>
			{["image", "video"].includes(type) && (
				<div
					className={cn(
						"fixed bottom-20 is-vertical:inset-x-4 is-horizontal:bottom-[3.5vw] is-horizontal:right-[3.5vw] ",
						"w-auto z-30"
					)}
				>
					<Listbox
						containerClassName={cn(
							"starting:opacity-0 translate-0 starting:translate-y-4 transition duration-800 delay-800"
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
						onSelected={option => {
							navigate({
								to: ".",
								params: {
									mediaType: type,
								},
								search: {
									uploader: option?.value || undefined,
								},
							})
						}}
						value={uploader}
						placeholder={defaultLabel}
						isClearable
					/>
				</div>
			)}
		</>
	)
}
