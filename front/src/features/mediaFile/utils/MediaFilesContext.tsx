import { type Dispatch, type SetStateAction, createContext } from "react"

import type { MediaFile } from "../api/types"

export type MediaFilesContextProps = {
	files: MediaFile[]
	setFiles: Dispatch<SetStateAction<MediaFile[]>>
}

export const MediaFilesContext = createContext<MediaFilesContextProps>({
	files: [],
	setFiles: () => undefined,
})
