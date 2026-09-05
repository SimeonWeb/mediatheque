import type { TypeFromArrayConst } from "@/utils/types"
import { cva } from "class-variance-authority"

export const streamingService = [
	"apple-music",
	"spotify",
	"deezer",
] as const

export type StreamingService = TypeFromArrayConst<typeof streamingService>

export const getStreamingServiceLabel = (service: StreamingService) => {
	switch (service) {
		case "apple-music":
			return "Apple Music"
		case "spotify":
			return "Spotify"
		case "deezer":
			return "Deezer"
	}
}

export const getStreamingServiceUrl = (service: StreamingService, meta: Record<string, string>) => {
	switch (service) {
		case "apple-music":
			return meta.appleMusicUrl
		case "spotify":
			return meta.spotifyUrl
		case "deezer":
			return meta.deezerUrl
	}
}

export const streamingServiceVariants = cva(
	"sm:flex-1",
	{
		variants: {
			service: {
				"apple-music": "hover:not-data-disabled:text-[#d60017] focus-visible:text-[#d60017]",
				"spotify": "hover:not-data-disabled:text-[#1ED760] focus-visible:text-[#1ED760]",
				"deezer": "hover:not-data-disabled:text-[#a238ff] focus-visible:text-[#a238ff]",
			},
		},
	}
)

