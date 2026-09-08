import { getPluralizedText } from "@/utils/text"

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

export const getMediaTypePluralizedLabel = (amount: number, type: string)=> {
	switch (type) {
		case "image":
			return getPluralizedText(amount, "photos", "photo")
		case "video":
			return getPluralizedText(amount, "vidéos", "vidéo")
		case "audio":
			return getPluralizedText(amount, "sons", "son")
		case "document":
			return getPluralizedText(amount, "documents", "document")
		default:
			return getPluralizedText(amount, "autres", "autre")
	}
}

export const getMediaTypePluralizedNumberedLabel = (amount: number, type: string)=> {
	switch (type) {
		case "image":
			return getPluralizedText(amount, "{amount} photos", "{amount} photo")
		case "video":
			return getPluralizedText(amount, "{amount} vidéos", "{amount} vidéo")
		case "audio":
			return getPluralizedText(amount, "{amount} sons", "{amount} son")
		case "document":
			return getPluralizedText(amount, "{amount} documents", "{amount} document")
		default:
			return getPluralizedText(amount, "{amount} autres", "{amount} autre")
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
