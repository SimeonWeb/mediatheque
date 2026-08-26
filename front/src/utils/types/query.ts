import type { OmitKeyof, UseQueryOptions } from "@tanstack/react-query"

import type { ApiList, ListQueryParams } from "./api"

export type QueryOptions<
	TData = unknown,
	TParams extends Record<string, unknown> = Record<string, unknown>,
> = OmitKeyof<
	UseQueryOptions<TData, Error, TData, (string | TParams)[]>,
	"queryKey" | "queryFn"
>

export type ListQueryOptions<
	TData = unknown,
	TParams extends Record<string, unknown> = Record<string, unknown>,
> = OmitKeyof<
	UseQueryOptions<ApiList<TData>, Error, ApiList<TData>, (string | ListQueryParams<TParams>)[]>,
	"queryKey" | "queryFn"
>

export type InfiniteListQueryResult<TData = unknown> = {
	pageParams: number[]
	pages: ApiList<TData>[]
}

export type InfiniteListQueryParams<TParams> = TParams & { pageParam: number }

export type InfiniteListQueryOptions<
	TData = unknown,
	TParams extends Record<string, unknown> = Record<string, unknown>,
> = OmitKeyof<
	UseQueryOptions<InfiniteListQueryResult<TData>, Error, InfiniteListQueryResult<TData>, (string | InfiniteListQueryParams<TParams>)[]>,
	"queryKey" | "queryFn"
>

export type QueryOptionsHandler<
	TData = unknown,
	TParams extends Record<string, unknown> = Record<string, unknown>,
> = (params?: Partial<ListQueryParams<TParams>>, options?: ListQueryOptions<TData, TParams>) => UseQueryOptions<ApiList<TData>, Error, ApiList<TData>, (string | NoInfer<ListQueryParams<TParams>>)[]>
