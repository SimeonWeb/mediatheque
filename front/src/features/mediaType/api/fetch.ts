import { fetchToJsonWithPagination, toSearchParams, withSearchParams } from "@/utils/fetch"
import type { ListQueryParams } from "@/utils/types/api"

import type { MediaTypeItem } from "./types"
import type { MediaTypesQueryFilters } from "../schemas/queryFilters"


export const getMediaTypes = (params: ListQueryParams<MediaTypesQueryFilters>, init?: RequestInit) => (
	fetchToJsonWithPagination<MediaTypeItem>(
		withSearchParams("/media_types", toSearchParams(params)),
		init
	)
)
