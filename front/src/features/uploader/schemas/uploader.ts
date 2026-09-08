import { z } from "zod"

import { zf } from "@/utils/zod"

export const addUploaderSchema = z.object({
	name: zf.string("Votre nom"),
})

export type AddUploaderFormValues = z.input<typeof addUploaderSchema>
export type AddUploaderTransformedValues = z.output<typeof addUploaderSchema>

export const addUploaderDefaultValues = (): AddUploaderFormValues => ({
	name: null,
})
