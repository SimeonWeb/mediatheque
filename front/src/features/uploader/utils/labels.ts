import type { EntityLabel } from "@/utils/types/entityLabel"

export const uploaderEntityLabel = {
	name: "uploader",
	isFeminine: false,
	label: "Photographe",
	plural: "Photographes",
} as const satisfies EntityLabel
