import type { ListQueryOptions } from "@/utils/types/query"
import type { ListQueryParams } from "@/utils/types/api"
import { listQueryOptions } from "@/utils/query"

import type { UploaderItem } from "./types"
import type { UploadersQueryFilters } from "../schemas/queryFilters"
import { getUploaders } from "./fetch"

export const uploadersQueryOptions = (params: Partial<ListQueryParams<UploadersQueryFilters>> = {}, options: ListQueryOptions<UploaderItem, UploadersQueryFilters> = {}) => (
	listQueryOptions("getUploaders", getUploaders, params, options)
)
