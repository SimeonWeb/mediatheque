import { type ZodType, z } from "zod"
import type { FieldValues } from "react-hook-form"
import type { RowData } from "@tanstack/react-table"
import { createContext } from "react"

export type FormMetaProps<
	TData extends RowData = RowData,
	TFieldValues extends FieldValues = FieldValues,
	TTransformedValues extends FieldValues = TFieldValues,
> = {
	schema: ZodType<TTransformedValues, TFieldValues>
	data: TData | undefined
}

export const FormMeta = createContext<FormMetaProps>({
	schema: z.object({}),
	data: undefined,
})
