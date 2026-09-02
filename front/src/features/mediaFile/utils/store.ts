import { create } from "zustand"

import type { MediaFile } from "@/features/mediaFile/api/types"

export type FilesState = {
	items: MediaFile[]
}

export const useFiles = create<FilesState>()(
	() => ({
		items: [],
	}),
)
