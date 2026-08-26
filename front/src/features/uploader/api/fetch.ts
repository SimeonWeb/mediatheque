import { fetchToJsonWithPagination, toSearchParams, withSearchParams } from "@/utils/fetch"
import type { ListQueryParams } from "@/utils/types/api"

import type { UploaderItem } from "./types"
import type { UploadersQueryFilters } from "../schemas/queryFilters"

export const getUploaders = (params: ListQueryParams<UploadersQueryFilters>, init?: RequestInit) => (
	fetchToJsonWithPagination<UploaderItem>(
		withSearchParams("/uploaders", toSearchParams(params)),
		init
	)
)
