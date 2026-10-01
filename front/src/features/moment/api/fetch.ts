import { fetchToJson, fetchToJsonWithPagination, toSearchParams, withSearchParams } from "@/utils/fetch"
import type { ListQueryParams } from "@/utils/types/api"
import { queryClient } from "@/utils/queryClient"

import type { Moment } from "./types"
import type { MomentsQueryFilters } from "../schemas/queryFilters"


export const invalidateMomentQueries = (moment?: Moment) => (
	queryClient.invalidateQueries({
		predicate: ({ queryKey }) => (
			queryKey[0] === "getMoments"
			// @ts-expect-error queryKey can be typed
			|| queryKey[0] === "getMoment" && (!moment?.id || queryKey[1]?.id === moment.id)
		),
	})
)

export const getMoment = (id: Moment["id"], init?: RequestInit) => (
	fetchToJson<Moment>(
		`/moments/${id}`,
		init
	)
)

export const getMoments = (params: ListQueryParams<MomentsQueryFilters>, init?: RequestInit) => (
	fetchToJsonWithPagination<Moment>(
		withSearchParams("/moments", toSearchParams(params)),
		init
	)
)
