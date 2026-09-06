import type { AudioPlaylist } from "../api/types"

export const getTotalTime = ({ items }: AudioPlaylist) => (
	items.reduce(
		(prev, current) => {
			return prev + current.duration
		},
		0
	)
)
