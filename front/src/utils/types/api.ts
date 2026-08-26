import type { PaginationQueryParams } from "../pagination"

export type ApiPagination = {
	total: number
	offset: number
	items_per_page: number
	total_pages: number
	current_page: number
	has_next_page: boolean
	has_previous_page: boolean
}

export type ApiEntityWithId<E = unknown> = E & {
	id: number
}

export type ApiList<D> = {
	pagination: {
		total: number
		page: number
		itemsPerPage: number,
		lastPage: number
		nextPage: number | null
		previousPage: number | null
	}
	items: D[]
}

export type ListQueryParams<P>
	= PaginationQueryParams
	& P
