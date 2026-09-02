import { useContext } from "react"

import { FormMeta } from "./FormMeta"

export const useFormMeta = () => {
	const context = useContext(FormMeta)

	if (context === undefined) {
		throw new Error("useFormMeta must be used in a component wrapped into FormMeta provider")
	}

	return context
}
