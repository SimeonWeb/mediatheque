import type { MutationOptions } from "@tanstack/react-query"

import type { ListQueryOptions, QueryOptions } from "@/utils/types/query"
import { itemQueryOptions, listQueryOptions, mutationOptions } from "@/utils/query"
import type { ListQueryParams } from "@/utils/types/api"

import { addMediaFile, getMediaFile, getMediaFiles, invalidateMediaFileQueries } from "./fetch"
import type { AddMediaFileTransformedValues } from "../schemas/mediaFile"
import type { MediaFile } from "./types"
import type { MediaFilesQueryFilters } from "../schemas/queryFilters"

export const mediaFilesQueryOptions = (params: Partial<ListQueryParams<MediaFilesQueryFilters>> = {}, options: ListQueryOptions<MediaFile, MediaFilesQueryFilters> = {}) => (
	listQueryOptions("getMediaFiles", getMediaFiles, params, options)
)

export const mediaFileQueryOptions = (id?: MediaFile["id"], options: QueryOptions<MediaFile> = {}, init?: RequestInit) => (
	itemQueryOptions("getMediaFile", getMediaFile, id, options, init)
)

export const addMediaFileOptions = (options?: MutationOptions<MediaFile, Error, AddMediaFileTransformedValues>) => (
	mutationOptions(addMediaFile, invalidateMediaFileQueries, options)
)
