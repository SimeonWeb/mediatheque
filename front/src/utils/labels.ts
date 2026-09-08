import { isVowelFirst, upperFirst } from "./text"
import type { EntityLabel } from "./types/entityLabel"

/**
 * @returns "la " | "l'" | "le "
 */
export const getEntityDefiniteArticle = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	isVowelFirst(entityLabel.label[0]) ? "l'" : entityLabel.isFeminine ? "la " : "le "
)

/**
 * @returns "la ${label}" | "l'${label}" | "le ${label}"
 */
export const withEntityDefiniteArticle = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`${getEntityDefiniteArticle(entityLabel)}${entityLabel.label}`
)

/**
 * @returns "une " | "un "
 */
export const getEntityIndefiniteArticle = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	entityLabel.isFeminine ? "une " : "un "
)

/**
 * @returns "une ${label}" | "un ${label}"
 */
export const withEntityIndefiniteArticle = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`${getEntityIndefiniteArticle(entityLabel)}${entityLabel.label}`
)

/**
 * @returns "cette " | "cet " | "ce "
 */
export const getEntityDemonstrativeAdjective = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	entityLabel.isFeminine ? "cette " : isVowelFirst(entityLabel.label[0]) ? "cet " : "ce "
)

/**
 * @returns "cette ${label}" | "cet ${label}" | "ce ${label}"
 */
export const withEntityDemonstrativeAdjective = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`${getEntityDemonstrativeAdjective(entityLabel)}${entityLabel.label}`
)

/**
 * Actions
 */

export const getEntityDefiniteActionLabel = (action: string, entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`${upperFirst(action)} ${withEntityDefiniteArticle(entityLabel)}`
)

export const getEntityIndefiniteActionLabel = (action: string, entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`${upperFirst(action)} ${withEntityIndefiniteArticle(entityLabel)}`
)

export const getEntityReadLabel = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`Afficher ${withEntityDefiniteArticle(entityLabel)}`
)

export const getEntityAddLabel = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`Ajouter ${withEntityIndefiniteArticle(entityLabel)}`
)

export const getEntityRequestLabel = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`Demander ${withEntityDefiniteArticle(entityLabel)}`
)

export const getEntityEditLabel = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`Modifier ${withEntityDefiniteArticle(entityLabel)}`
)

export const getEntityDeleteLabel = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`Supprimer ${withEntityDefiniteArticle(entityLabel)}`
)

export const getEntityDownloadLabel = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`Télécharger ${withEntityDefiniteArticle(entityLabel)}`
)

export const getEntityAskForActionLabel = (action: string, entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	`Voulez-vous ${action} ${withEntityDemonstrativeAdjective(entityLabel)} ?`
)

export const getEntityNoDataLabel = (entityLabel: Pick<EntityLabel, "isFeminine" | "label">) => (
	entityLabel.isFeminine
		? `Aucune ${entityLabel.label} trouvée`
		: `Aucun ${entityLabel.label} trouvé`
)
