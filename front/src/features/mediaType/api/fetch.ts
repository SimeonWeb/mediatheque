import { fetchToJsonWithPagination, toSearchParams, withSearchParams } from "@/utils/fetch"
import type { ListQueryParams } from "@/utils/types/api"

import type { MediaTypeItem } from "./types"
import type { MediaTypesQueryFilters } from "../schemas/queryFilters"
import { queryClient } from "@/utils/queryClient"

export const invalidateMediaTypeQueries = (mediaType?: MediaTypeItem) => (
	queryClient.invalidateQueries({
		predicate: ({ queryKey }) => (
			queryKey[0] === "getMediaTypes"
			// @ts-expect-error queryKey can be typed
			|| queryKey[0] === "getMediaType" && (!mediaType?.id || queryKey[1]?.id === mediaType.id)
		),
	})
)

export const getMediaTypes = (params: ListQueryParams<MediaTypesQueryFilters>, init?: RequestInit) => (
	fetchToJsonWithPagination<MediaTypeItem>(
		withSearchParams("/media_types", toSearchParams(params)),
		init
	)
)
