import type { MutationOptions } from "@tanstack/react-query"

import { listQueryOptions, mutationOptions } from "@/utils/query"
import type { ListQueryOptions } from "@/utils/types/query"
import type { ListQueryParams } from "@/utils/types/api"

import type { AddUploaderError, Uploader, UploaderItem } from "./types"
import { addUploader, getUploaders, invalidateUploaderQueries } from "./fetch"
import type { AddUploaderTransformedValues } from "../schemas/uploader"
import type { UploadersQueryFilters } from "../schemas/queryFilters"

export const uploadersQueryOptions = (params: Partial<ListQueryParams<UploadersQueryFilters>> = {}, options: ListQueryOptions<UploaderItem, UploadersQueryFilters> = {}) => (
	listQueryOptions("getUploaders", getUploaders, params, options)
)

export const addUploaderOptions = (options?: MutationOptions<Uploader, AddUploaderError, AddUploaderTransformedValues>) => (
	mutationOptions(addUploader, invalidateUploaderQueries, options)
)
