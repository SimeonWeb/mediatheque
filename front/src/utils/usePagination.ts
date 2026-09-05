import { useNavigate, useSearch } from "@tanstack/react-router"
import type { Updater } from "@tanstack/react-table"

import { type PaginationState, paginationStateToSearchParams } from "./pagination"
import { parseDatagridSearchParams } from "./datagrid"
import { useCurrentRouteId } from "./route"

export const usePagination = () => {
	const from = useCurrentRouteId()
	const navigate = useNavigate()
	const search = useSearch({ from })
	const { pagination: paginationSearchParams } = parseDatagridSearchParams(search)

	const pagination = paginationStateToSearchParams.encode(paginationSearchParams)

	return {
		pagination,
		onPaginationChange: (valueOrUpdater: Updater<PaginationState>) => {
			const value = typeof valueOrUpdater === "function" ? valueOrUpdater(pagination) : valueOrUpdater

			navigate({
				to: ".",
				search: prev => ({
					...prev,
					...paginationStateToSearchParams.decode(value),
				}),
			})
		},
	}
}
