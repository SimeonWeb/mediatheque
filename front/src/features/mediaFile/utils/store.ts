import { create } from "zustand"

import type { MediaFile } from "@/features/mediaFile/api/types"

export type FilesState = {
	items: MediaFile[]
	prevIndex: number | undefined
	containerElement: HTMLDivElement | null
}

export const useFiles = create<FilesState>()(
	() => ({
		items: [],
		prevIndex: undefined,
		containerElement: null,
	}),
)
