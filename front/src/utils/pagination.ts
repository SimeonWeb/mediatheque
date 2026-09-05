import { z } from "zod"

/**
 * Defaults
 */

export const defaultPage = 1
export const defaultItemsPerPage = 100
export const paginationPerPageOptions = [25, 50, 75, 100]

/**
 * Schemas
 */

export const paginationSearchParamsSchema = z.object({
	perPage: z.number().optional().catch(undefined),
	page: z.number().optional().catch(undefined),
})

export type PaginationSearchParams = z.output<typeof paginationSearchParamsSchema>

export const paginationQueryParamsSchema = z.object({
	page: z.number().default(defaultPage),
	itemsPerPage: z.number().default(defaultItemsPerPage),
})

export type PaginationQueryParams = z.input<typeof paginationQueryParamsSchema>

export const paginationStateSchema = z.object({
	pageIndex: z.number().default(defaultPage - 1),
	pageSize: z.number().default(defaultItemsPerPage),
})

export type PaginationState = z.input<typeof paginationStateSchema>

/**
 * Codecs
 */

export const paginationStateToSearchParams = z.codec(
	paginationStateSchema,
	paginationSearchParamsSchema,
	{
		decode: state => (
			state
				? {
					perPage: !isPaginationDefaultPageSize(state) ? state.pageSize : undefined,
					page: !isPaginationDefaultPageIndex(state) ? state.pageIndex + 1 : undefined,
				}
				: {
					perPage: undefined,
					page: undefined,
				}
		),
		encode: search => (
			search
				? {
					pageSize: search.perPage || getPaginationDefaultState().pageSize,
					pageIndex: search.page ? search.page - 1 : getPaginationDefaultState().pageIndex,
				}
				: getPaginationDefaultState()
		),
	}
)

export const paginationStateToQueryParams = z.codec(
	paginationStateSchema.optional(),
	paginationQueryParamsSchema,
	{
		decode: state => (
			state
				? {
					page: state.pageIndex + 1,
					itemsPerPage: state.pageSize,
				}
				: {
					page: defaultPage,
					itemsPerPage: defaultItemsPerPage,
				}
		),
		encode: queryParams => ({
			pageIndex: (queryParams.page || defaultPage) - 1,
			pageSize: queryParams.itemsPerPage || defaultItemsPerPage,
		}),
	}
)

/**
 * Helpers
 */

export const parsePaginationSearchParams = (params?: Partial<PaginationSearchParams>) => ({
	perPage: params?.perPage || paginationPerPageOptions[0],
	page: params?.page || 1,
})

export const getPaginationDefaultState = (value?: Partial<PaginationState>) => ({
	pageSize: value?.pageSize || paginationPerPageOptions[0],
	pageIndex: value?.pageIndex || 0,
})

export const isPaginationDefaultState = (state: PaginationState) => {
	const defaultParams = getPaginationDefaultState()

	return state.pageIndex === defaultParams.pageIndex && state.pageSize === defaultParams.pageSize
}

export const isPaginationDefaultPageIndex = (state: PaginationState) => (
	state.pageIndex === getPaginationDefaultState().pageIndex
)

export const isPaginationDefaultPageSize = (state: PaginationState) => (
	state.pageSize === getPaginationDefaultState().pageSize
)
