import { z } from "zod"

/**
 * Defaults
 */

export const sortingOrderOptions = ["asc", "desc"] as const

/**
 * Schemas
 */

export const sortingSearchParamsSchema = z.object({
	sort: z.string().optional().catch(undefined),
	order: z.enum(sortingOrderOptions).optional().catch(undefined),
})

export type SortingSearchParams = z.output<typeof sortingSearchParamsSchema>

export const sortingQueryParamsSchema = z.object({
	sort: z.string().optional(),
	order: z.enum(sortingOrderOptions).optional(),
})

export type SortingQueryParams = z.output<typeof sortingQueryParamsSchema>

export const sortingStateSchema = z.array(
	z.object({
		id: z.string(),
		desc: z.boolean(),
	})
)

export type SortingState = z.output<typeof sortingStateSchema>

/**
 * Codecs
 */

export const sortingStateToSearchParams = z.codec(
	sortingStateSchema,
	sortingSearchParamsSchema,
	{
		decode: state => ({
			sort: state && state[0] ? state[0].id : undefined,
			order: state && state[0] && state[0].desc ? sortingOrderOptions[1] : undefined,
		}),
		encode: search => (
			search && search.sort
				? [
					{
						id: search.sort,
						desc: search.order === "desc",
					},
				]
				: []
		),
	}
)

export const sortingSearchParamsToQueryParams = z.codec(
	sortingSearchParamsSchema.optional(),
	sortingQueryParamsSchema.optional(),
	{
		decode: search => search,
		encode: query => query,
	}
)

/**
 * Helpers
 */

export const parseSortingSearchParams = (params?: SortingSearchParams) => ({
	sort: params?.sort,
	order: params?.order,
})
