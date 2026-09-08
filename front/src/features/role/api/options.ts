import { queryOptions } from "@tanstack/react-query"

import type { QueryOptions } from "@/utils/types/query"

import type { RoleItem } from "./types"
import { getRole } from "./fetch"

export const roleQueryOptions = (options: QueryOptions<RoleItem> = {}) => (
	queryOptions({
		...options,
		queryKey: ["getRole"],
		queryFn: ({ signal }) => getRole({ signal }),
	})
)
