import { queryOptions } from "@tanstack/react-query"

import { getFileUrl } from "@/utils/file"

import type { AudioPlaylist } from "./types"

export const audioPlaylistQueryOptions = (src: string) => queryOptions<AudioPlaylist>({
	queryKey: ["playlist", src],
	queryFn: async () => {
		const response = await fetch(
			getFileUrl(src),
			{
				headers: {
					Accept: "application/json",
				},
			},
		)

		return await response.json()
	},
})
