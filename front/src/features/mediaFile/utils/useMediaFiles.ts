import { useContext } from "react"

import { MediaFilesContext } from "./MediaFilesContext"

export const useMediaFilesContext = () => {
	const context = useContext(MediaFilesContext)

	if (context === undefined) {
		throw new Error("useMediaFilesContext must be used in a component wrapped into MediaFilesContext provider")
	}

	return context
}
