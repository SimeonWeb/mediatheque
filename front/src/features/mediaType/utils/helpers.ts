import { useAuth } from "@/stores/auth"

import { allowedMimeType } from "../api/enums"

export const getAllowedMimeTypes = () => {
	const { role } = useAuth.getState()

	if (role === "UPLOAD") {
		return allowedMimeType.filter(mime => mime.startsWith("image") || mime.startsWith("video"))
	}

	return allowedMimeType
}

export const getAllowedExtensions = () => (
	getAllowedMimeTypes().map(mime => mime.replace(/^.+\//g, ""))
)
