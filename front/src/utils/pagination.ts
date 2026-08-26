import { z } from "zod"

export const defaultPage = 1
export const defaultItemsPerPage = 100

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
