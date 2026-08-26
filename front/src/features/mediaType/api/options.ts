import type { ListQueryOptions } from "@/utils/types/query"
import type { ListQueryParams } from "@/utils/types/api"
import { listQueryOptions } from "@/utils/query"

import type { MediaTypeItem } from "./types"
import type { MediaTypesQueryFilters } from "../schemas/queryFilters"
import { getMediaTypes } from "./fetch"

export const mediaTypesQueryOptions = (params: Partial<ListQueryParams<MediaTypesQueryFilters>> = {}, options: ListQueryOptions<MediaTypeItem, MediaTypesQueryFilters> = {}) => (
	listQueryOptions("getMediaTypes", getMediaTypes, params, options)
)
