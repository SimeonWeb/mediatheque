import { fetchOptions, fetchToJson, fetchToJsonWithPagination, toSearchParams, withSearchParams } from "@/utils/fetch"
import type { ListQueryParams } from "@/utils/types/api"
import { queryClient } from "@/utils/queryClient"

import type { Uploader, UploaderItem } from "./types"
import type { AddUploaderTransformedValues } from "../schemas/uploader"
import type { UploadersQueryFilters } from "../schemas/queryFilters"

export const invalidateUploaderQueries = (uploader?: Uploader) => (
	queryClient.invalidateQueries({
		predicate: ({ queryKey }) => (
			queryKey[0] === "getUploaders"
			// @ts-expect-error queryKey can be typed
			|| queryKey[0] === "getUploader" && (!uploader?.id || queryKey[1]?.id === uploader.id)
		),
	})
)

export const getUploaders = (params: ListQueryParams<UploadersQueryFilters>, init?: RequestInit) => (
	fetchToJsonWithPagination<UploaderItem>(
		withSearchParams("/uploaders", toSearchParams(params)),
		init
	)
)

export const addUploader = (formData: AddUploaderTransformedValues) => (
	fetchToJson<Uploader>(
		"/uploaders",
		fetchOptions("POST", formData),
	)
)
