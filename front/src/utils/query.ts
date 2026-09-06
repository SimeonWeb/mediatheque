import { type DefaultError, type MutationOptions, keepPreviousData, queryOptions } from "@tanstack/react-query"

import type { ApiCursorList, ApiList, ListQueryParams } from "./types/api"
import type { CursorListQueryOptions, ListQueryOptions, QueryOptions } from "./types/query"
import { type PaginationState, defaultItemsPerPage, paginationStateToQueryParams } from "./pagination"

export type ListParams<P>
	= PaginationState
	& P

export const listQueryOptions = <TData = unknown, TParams extends Record<string, unknown> = Record<string, unknown>>(
	queryKey: string,
	queryFn: (params: ListQueryParams<TParams>, init?: RequestInit) => Promise<ApiList<TData>>,
	params: Partial<ListParams<TParams>>,
	options: ListQueryOptions<TData, TParams>
) => {
	const withDefaultParams = withDefaultListQueryParams(params)

	return queryOptions({
		placeholderData: keepPreviousData,
		...options,
		queryKey: [queryKey, withDefaultParams],
		queryFn: ({ signal }) => queryFn(withDefaultParams, { signal }),
	})
}

export const cursorListQueryOptions = <TData = unknown, TParams extends Record<string, unknown> = Record<string, unknown>>(
	queryKey: string,
	queryFn: (params: ListQueryParams<TParams>, init?: RequestInit) => Promise<ApiCursorList<TData>>,
	params: Partial<ListParams<TParams>>,
	options: CursorListQueryOptions<TData, TParams>
) => {
	const withDefaultParams = {
		itemsPerPage: defaultItemsPerPage,
		...params,
	} as ListQueryParams<TParams>

	return queryOptions({
		placeholderData: keepPreviousData,
		...options,
		queryKey: [queryKey, withDefaultParams],
		queryFn: ({ signal }) => queryFn(withDefaultParams, { signal }),
	})
}

export const itemQueryOptions = <TData = unknown, TId extends string | number = string | number>(
	queryKey: string,
	queryFn: (id: TId, init?: RequestInit) => Promise<TData>,
	id?: TId,
	options: QueryOptions<TData> = {},
	init?: RequestInit
) => (
	queryOptions({
		...options,
		enabled: !!id && (!("enabled" in options) || options.enabled),
		queryKey: [queryKey, { id, init }],
		queryFn: ({ signal }) => queryFn(id!, { ...init, signal }),
	})
)

export const mutationOptions = <
	TData = unknown,
	TError = DefaultError,
	TVariables = void,
	TContext = unknown,
>(
	mutationFn: MutationOptions<TData, TError, TVariables, TContext>["mutationFn"],
	invalidateQueries?: (data?: TData) => Promise<void>,
	options?: MutationOptions<TData, TError, TVariables, TContext>
): MutationOptions<TData, TError, TVariables, TContext> => ({
	...options,
	mutationFn,
	onSuccess: invalidateQueries,
})

export const withDefaultListQueryParams = <TParams extends Record<string, unknown> = Record<string, unknown>>(params: Partial<ListParams<TParams>>) => ({
	...paginationStateToQueryParams.decode(params),
	...params,
} as ListQueryParams<TParams>)
