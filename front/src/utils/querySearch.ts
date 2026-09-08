import { z } from "zod"

/**
 * Schemas
 */

export const querySearchParamsSchema = z.object({
	search: z.string().optional().catch(undefined),
})

export type QuerySearchParams = z.output<typeof querySearchParamsSchema>

export const querySearchQueryParamsSchema = z.object({
	search: z.string().optional(),
})

export type QuerySearchQueryParams = z.output<typeof querySearchQueryParamsSchema>

export const querySearchStateSchema = z.object({
	search: z.string(),
})

export type QuerySearchState = z.output<typeof querySearchStateSchema>

/**
 * Codecs
 */

export const querySearchStateToSearchParams = z.codec(
	querySearchStateSchema,
	querySearchParamsSchema,
	{
		decode: state => (
			state.search
				? {
					search: state.search || undefined,
				}
				: {}
		),
		encode: search => ({
			search: search.search || "",
		}),
	}
)

export const querySearchParamsToQueryParams = z.codec(
	querySearchParamsSchema.optional(),
	querySearchQueryParamsSchema,
	{
		decode: search => (
			search?.search
				? {
					search: search.search,
				}
				: {}
		),
		encode: query => ({
			search: query.search,
		}),
	}
)

/**
 * Helpers
 */

export const parseQuerySearchParams = (params?: QuerySearchParams) => ({
	search: params?.search || undefined,
})
