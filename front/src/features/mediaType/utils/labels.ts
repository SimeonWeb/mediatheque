export const getMediaTypeLabel = (type: string)=> {
	switch (type) {
		case "image":
			return "Photos"
		case "video":
			return "Vidéos"
		case "audio":
			return "Sons"
		case "document":
			return "Documents"
		default:
			return "Autres"
	}
}
export const getMediaTypeDefautLabel = (type: string)=> {
	switch (type) {
		case "image":
			return "Toutes les photos"
		case "video":
			return "Toutes les vidéos"
		case "audio":
			return "Tous les sons"
		case "document":
			return "Tous les documents"
		default:
			return "Tous les autres"
	}
}
