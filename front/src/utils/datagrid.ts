import type { Column, RowData, Table } from "@tanstack/react-table"
import { useEffect, useRef } from "react"
import { z } from "zod"

// import { type FiltersSearchParams, parseFiltersSearchParams } from "./filters"
import {
	paginationPerPageOptions,
	paginationQueryParamsSchema,
	paginationSearchParamsSchema,
	paginationStateToQueryParams,
	paginationStateToSearchParams,
	parsePaginationSearchParams,
} from "./pagination"
import {
	parseQuerySearchParams,
	querySearchParamsSchema,
	querySearchParamsToQueryParams,
	querySearchQueryParamsSchema,
} from "./querySearch"
import {
	parseSortingSearchParams,
	sortingQueryParamsSchema,
	sortingSearchParamsSchema,
	sortingSearchParamsToQueryParams,
} from "./sorting"
import type { ListQueryParams } from "./types/api"
import { cn } from "./cn"

export const datagridSearchSchema = paginationSearchParamsSchema
	.extend(querySearchParamsSchema.shape)
	.extend(sortingSearchParamsSchema.shape)

export const datagridQueryParamsSchema = paginationQueryParamsSchema
	.extend(querySearchQueryParamsSchema.shape)
	.extend(sortingQueryParamsSchema.shape)

export type DatagridSearchParams<TFilters extends Record<string, unknown> = Record<string, unknown>> = (
	& z.output<typeof datagridSearchSchema>
	& TFilters
)

export const getDefaultRowCount = <TData extends RowData>(table: Table<TData>) => {
	const rowCount = table.getRowCount()
	const pageSize = table.getState().pagination?.pageSize || paginationPerPageOptions[0]

	return rowCount ? Math.min(rowCount, pageSize) : pageSize
}

export const getColumnClassName = <TData extends RowData>(column: Column<TData, unknown>, className?: string) => cn(
	className,
	typeof column.columnDef.meta?.className === "function"
		? column.columnDef.meta?.className(column)
		: column.columnDef.meta?.className,
)

export const getColumnResponsiveClassName = <TData extends RowData>(column: Column<TData, unknown>, className?: string) => cn(
	className,
	typeof column.columnDef.meta?.responsiveClassName === "function"
		? column.columnDef.meta?.responsiveClassName(column)
		: column.columnDef.meta?.responsiveClassName,
)

export const datagridSearchParamsToQueryParams = <TFilters extends Record<string, unknown> = Record<string, unknown>>(params: DatagridSearchParams<TFilters>) => ({
	// ...parseFiltersSearchParams<TFilters>(params),
	...paginationStateToQueryParams.decode(paginationStateToSearchParams.encode(params)),
	...querySearchParamsToQueryParams.decode(params),
	...sortingSearchParamsToQueryParams.decode(params),
} as ListQueryParams<TFilters>)

export const parseDatagridSearchParams = <TFilters extends Record<string, unknown> = Record<string, unknown>>(params: DatagridSearchParams<TFilters>) => ({
	// filters: parseFiltersSearchParams(params),
	pagination: parsePaginationSearchParams(params),
	querySearch: parseQuerySearchParams(params),
	sorting: parseSortingSearchParams(params),
})

/**
 * Check if element is into an interactive element, eg: button, a...
 */
export const inInteractive = (element: HTMLElement): boolean => {
	if (["A", "BUTTON"].includes(element.tagName)) {
		return true
	}

	if (!element.parentElement) {
		return false
	}

	return inInteractive(element.parentElement)
}

type CellEvent = {
	cellElement: HTMLTableCellElement
	handleClick: EventListener
}

/**
 * Make all table row clickable if there is primary link within
 */
export const useCellEvents = (isLoading?: boolean) => {
	const tableRef = useRef<HTMLTableElement>(null)

	useEffect(
		() => {
			if (isLoading || !tableRef.current) {
				return
			}

			const rowElements = tableRef.current.querySelectorAll(".Row")

			const cellEvents: CellEvent[] = []

			for (const rowElement of rowElements) {
				const primaryLinkElement = rowElement.querySelector(".PrimaryLink") as HTMLAnchorElement | HTMLButtonElement

				if (!primaryLinkElement) {
					continue
				}

				const handleClick: EventListener = event => {
					if (inInteractive(event.target as HTMLElement)) {
						return
					}

					primaryLinkElement.click()
				}

				for (const cellElement of rowElement.querySelectorAll(".Cell:not(.RowActions)")) {
					cellEvents.push({
						cellElement: cellElement as HTMLTableCellElement,
						handleClick,
					})
				}
			}

			for (const cellEvent of cellEvents) {
				cellEvent.cellElement.style.setProperty("cursor", "pointer")
				cellEvent.cellElement.addEventListener("click", cellEvent.handleClick)
			}

			return () => {
				for (const cellEvent of cellEvents) {
					cellEvent.cellElement.style.removeProperty("cursor")
					cellEvent.cellElement.removeEventListener("click", cellEvent.handleClick)
				}
			}
		},
		[isLoading]
	)

	return tableRef
}
