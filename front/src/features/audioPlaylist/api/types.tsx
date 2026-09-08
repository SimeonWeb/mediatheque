export type AudioPlaylistItem = {
	artwork: string
	title: string
	artist: string
	album: string
	duration: number
}

export type AudioPlaylist = {
	title: string
	artwork: string
	source: string
	items: AudioPlaylistItem[]
}
