import { fetchOptions, fetchToJson, fetchToJsonWithPagination, toSearchParams, withSearchParams } from "@/utils/fetch"
import type { ListQueryParams } from "@/utils/types/api"
import { queryClient } from "@/utils/queryClient"

import type { AddMediaFileTransformedValues } from "../schemas/mediaFile"
import type { MediaFile } from "./types"
import type { MediaFilesQueryFilters } from "../schemas/queryFilters"


export const invalidateMediaFileQueries = (mediaFile?: MediaFile) => (
	queryClient.invalidateQueries({
		predicate: ({ queryKey }) => (
			queryKey[0] === "getMediaFiles"
			// @ts-expect-error queryKey can be typed
			|| queryKey[0] === "getMediaFile" && (!mediaFile?.id || queryKey[1]?.id === mediaFile.id)
		),
	})
)

export const getMediaFile = (id: MediaFile["id"], init?: RequestInit) => (
	fetchToJson<MediaFile>(
		`/media_files/${id}`,
		init
	)
)

export const getMediaFiles = (params: ListQueryParams<MediaFilesQueryFilters>, init?: RequestInit) => (
	fetchToJsonWithPagination<MediaFile>(
		withSearchParams("/media_files", toSearchParams(params)),
		init
	)
)

export const addMediaFile = (formData: AddMediaFileTransformedValues) => (
	fetchToJson<MediaFile>(
		"/media_files",
		fetchOptions("POST", formData),
	)
)
