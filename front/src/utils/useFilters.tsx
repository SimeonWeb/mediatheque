import { useNavigate, useSearch } from "@tanstack/react-router"

import { FiltersDrawer } from "@/components/FiltersDrawer"

import type { FilterDef } from "./types/filters"
import { countActiveFilters } from "./filters"
import { openDrawer } from "./dialogs"
import { parseDatagridSearchParams } from "./datagrid"
import { useCurrentRouteId } from "./route"

export type UseFiltersProps<FD extends FilterDef> = {
	filtersDef: FD[]
	isDefaultOpen?: boolean
}

export const useFilters = <FD extends FilterDef>({ filtersDef }: UseFiltersProps<FD>) => {
	const from = useCurrentRouteId()
	const navigate = useNavigate()
	const search = useSearch({ from })

	const { filters } = parseDatagridSearchParams(search)

	const activeFiltersCount = !filters ? 0 : countActiveFilters(filters)

	const openFilters = (autoFocus?: string) => {
		openDrawer(
			<FiltersDrawer
				filtersDef={filtersDef}
				filters={filters}
				autoFocus={autoFocus}
			/>,
			{
				className: "md:max-w-md! h-screen",
			}
		)
	}

	// TODO Make stronger type
	const setFilters = (data: Record<string, unknown>) => (
		navigate({
			to: ".",
			search: prev => ({ ...prev, ...data }),
		})
	)

	return {
		hasFilters: filtersDef.length > 0,
		filtersDef,
		filters,
		activeFiltersCount,
		setFilters,
		openFilters,
	}
}
