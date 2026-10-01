import { type ComponentPropsWithRef, useMemo } from "react"
import dayjs from "dayjs"

import type { DialogEvents } from "@/stores/dialog"
import type { Moment } from "@/features/moment/api/types"
import type { PreviewProps } from "@/layouts/Dialogs"
import { cn } from "@/utils/cn"
import { defaultItemsPerPage } from "@/utils/pagination"
import { openPreview } from "@/utils/dialogs"

import { MediaGridItem, type MediaGridItemProps } from "./MediaGridItem"
import { MediaGridMoment } from "./MediaGridMoment"

export type MediaGridContainerProps = ComponentPropsWithRef<"div">

export const MediaGridContainer = ({ ref, children, className, ...props }: MediaGridContainerProps) => (
	<div
		ref={ref}
		className={cn(
			"grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-9 gap-1 is-horizontal:gap-1.5",
			className
		)}
		{...props}
	>
		{children}
	</div>
)

export type MediaGridProps = ComponentPropsWithRef<"div"> & DialogEvents & {
	items?: MediaGridItemProps[]
	moments?: Moment[]
	onItem?: PreviewProps["onItem"]
}

export const MediaGrid = ({ items = [], moments = [], onItem, onOpen, onClose, ...props }: MediaGridProps) => {
	const momentsWithItems = useMemo(
		() => {
			const defaultMoment = { id: 0, startsAt: items[0].createdAt, label: "", slug: "" } satisfies Moment
			const itemsWithIndex = items.map((item, index) => ({ item, index }))

			if (moments.length === 0) {
				return [{
					moment: defaultMoment,
					items: itemsWithIndex,
				}]
			}

			const allMoments = [
				...dayjs(items[0].createdAt).isBefore(moments[0].startsAt) ? [defaultMoment]: [],
				...moments,
			]

			const allMomentsWithItems = allMoments.flatMap((moment, index) => {
				const from = moment ? dayjs(moment.startsAt) : undefined
				const to = allMoments[index + 1] ? dayjs(allMoments[index + 1]!.startsAt) : undefined

				const momentItems = itemsWithIndex.filter(({ item }) => (
					(!from || from.isBefore(item.createdAt))
					&& (!to || to.isAfter(item.createdAt))
				))

				return momentItems.length > 0
					? [{
						moment,
						items: momentItems,
					}]
					: []
			})

			if (allMomentsWithItems.length === 1) {
				allMomentsWithItems[0].moment = defaultMoment
			}

			return allMomentsWithItems
		},
		[items, moments]
	)

	return (
		<div {...props}>
			{momentsWithItems.map(({ items, moment }, index) => (
				<div key={moment.id} className="col-span-full">
					<MediaGridMoment
						moment={moment}
						style={{
							transitionDelay: `${15 * (index % defaultItemsPerPage)}ms`,
						}}
					/>
					<MediaGridContainer>
						{items.map(({ item, index }) => (
							<button
								key={item.id}
								onClick={() => {
									openPreview(index, { onItem }, { onOpen, onClose })
								}}
								data-index={index}
								aria-label="Visualiser le document"
								className={cn(
									"cursor-pointer w-full aspect-square rounded-sm sm:rounded-md",
									"outline-2 sm:outline-offset-2 outline-transparent focus-visible:outline-primary",
									"translate-0 starting:opacity-0 starting:translate-y-4",
									"transition duration-500"
								)}
								style={{
									transitionDelay: `${15 * (index % defaultItemsPerPage)}ms`,
								}}
							>
								<MediaGridItem {...item} />
							</button>
						))}
					</MediaGridContainer>
				</div>
			))}
		</div>
	)
}
