import { type PropsWithChildren, useState } from "react"

import { MediaFilesContext, type MediaFilesContextProps } from "./MediaFilesContext"

export const MediaFilesProvider = ({ children }: PropsWithChildren) => {
	const [files, setFiles] = useState<MediaFilesContextProps["files"]>([])

	return (
		<MediaFilesContext value={{ files, setFiles }}>
			{children}
		</MediaFilesContext>
	)
}
