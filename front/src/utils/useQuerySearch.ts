import { type ChangeEvent, useEffect, useRef, useState } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"

import { parseDatagridSearchParams } from "./datagrid"
import { querySearchStateToSearchParams } from "./querySearch"
import { useCurrentRouteId } from "./route"

export const useQuerySearch = () => {
	const from = useCurrentRouteId()
	const navigate = useNavigate()
	const search = useSearch({ from })
	const { querySearch: querySearchSearchParams } = parseDatagridSearchParams(search)

	const querySearch = querySearchStateToSearchParams.encode(querySearchSearchParams)

	const [innerSearch, setInnerSearch] = useState(querySearch.search)
	const [isQuerySearchOpen, setIsQuerySearchOpen] = useState(!!querySearch.search)

	const timer = useRef<NodeJS.Timeout>(undefined)

	useEffect(
		() => {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setInnerSearch(querySearch.search)
		},
		[querySearch.search]
	)

	useEffect(
		() => {
			clearTimeout(timer.current)

			timer.current = setTimeout(
				() => {
					navigate({
						to: ".",
						search: ({ search, ...prev }) => ({
							...prev,
							...querySearchStateToSearchParams.decode({ search: innerSearch }),
						}),
					})
				},
				200
			)
		},
		[navigate, innerSearch]
	)

	return {
		querySearch: innerSearch,
		onSearchChange: (event: ChangeEvent<HTMLInputElement>) => {
			setInnerSearch(event.target.value)
		},
		isQuerySearchOpen,
		toggleQuerySearch: () => setIsQuerySearchOpen(prev => !prev),
		clearQuerySearch: () => {
			setInnerSearch("")
			setIsQuerySearchOpen(false)
		},
	}
}
