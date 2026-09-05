import { type RowData, type Updater, flexRender } from "@tanstack/react-table"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useState } from "react"

import type { SortingFieldProps } from "@/components/SortingField"
import type { TableChildrenProps } from "@/components/Datagrid"

import { type SortingState, sortingStateToSearchParams } from "./sorting"
import { parseDatagridSearchParams } from "./datagrid"
import { useCurrentRouteId } from "./route"

export const useSorting = () => {
	const from = useCurrentRouteId()
	const navigate = useNavigate()
	const search = useSearch({ from })
	const { sorting: sortingSearchParams } = parseDatagridSearchParams(search)

	const sorting = sortingStateToSearchParams.encode(sortingSearchParams)

	const [isSortingOpen, setIsSortingOpen] = useState(false)

	return {
		sorting,
		onSortingChange: (valueOrUpdater: Updater<SortingState>) => {
			const value = typeof valueOrUpdater === "function" ? valueOrUpdater(sorting) : valueOrUpdater

			navigate({
				to: ".",
				search: ({ sort, order, ...prev }) => ({
					...prev,
					...sortingStateToSearchParams.decode(value),
				}),
			})
		},
		isSortingOpen,
		toggleSorting: () => setIsSortingOpen(prev => !prev),
		getSortingFieldProps: <TData extends RowData>(table: TableChildrenProps<TData>) => ({
			sorting,
			options: table.getHeaderGroups().flatMap(headerGroup => (
				headerGroup.headers.flatMap(header => (
					header.column.getCanSort()
						? [
							{
								value: header.column.id,
								label: flexRender(header.column.columnDef.header, header.getContext()),
							},
						]
						:[]
				))
			)),
			onSelected: option => {
				if (!option) {
					table.setSorting(sortingStateToSearchParams.encode({}))

					return
				}

				table.setSorting(prev => ([
					{
						id: option.value,
						desc: !!prev[0]?.desc,
					},
				]))
			},
			onChangeDesc: () => {
				table.setSorting(prev => ([
					{
						...prev[0],
						desc: !prev[0].desc,
					},
				]))
			},
			onClear: () => {
				table.setSorting(sortingStateToSearchParams.encode({}))
				setIsSortingOpen(false)
			},
		} satisfies SortingFieldProps),
	}
}
