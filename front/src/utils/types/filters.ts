import type { ComponentProps, ElementType } from "react"

import type { FilterSchema, FilterSearchParamsSchema } from "../filters"

export type FilterDef<
	TField extends string = string,
	TSchema extends FilterSchema = FilterSchema,
	TSearchSchema extends FilterSearchParamsSchema = FilterSearchParamsSchema,
	TElementType extends ElementType = ElementType,
> = {
	field: TField
	schema: TSchema
	searchSchema: TSearchSchema
	component: TElementType
	componentProps: ComponentProps<TElementType>
	condition?: boolean | (() => boolean)
}
