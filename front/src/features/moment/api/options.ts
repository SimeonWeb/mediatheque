import type { ListQueryOptions, QueryOptions } from "@/utils/types/query"
import { itemQueryOptions, listQueryOptions } from "@/utils/query"
import type { ListQueryParams } from "@/utils/types/api"

import { getMoment, getMoments } from "./fetch"
import type { Moment } from "./types"
import type { MomentsQueryFilters } from "../schemas/queryFilters"

export const momentsQueryOptions = (params: Partial<ListQueryParams<MomentsQueryFilters>> = {}, options: ListQueryOptions<Moment, MomentsQueryFilters> = {}) => (
	listQueryOptions("getMoments", getMoments, params, options)
)

export const momentQueryOptions = (id?: Moment["id"], options: QueryOptions<Moment> = {}, init?: RequestInit) => (
	itemQueryOptions("getMoment", getMoment, id, options, init)
)
