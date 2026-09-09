import { create } from "zustand"

type PlayerProps = {
	isPlaying: boolean
	setIsPlaying: (value: boolean) => void
}

export type UserState = {
	isReady: boolean
	player: PlayerProps | null
}

export type UserAction = {
	initPlayer: (player: PlayerProps) => void
}

export const useUser = create<UserState & UserAction>()(
	set => ({
		isReady: false,
		player: null,
		initPlayer: player => {
			set({ player })
		},
	})
)
