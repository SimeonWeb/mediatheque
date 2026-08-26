import { z } from "zod"

export const addMediaFileSchema = z.object({

})

export type AddMediaFileFormValues = z.input<typeof addMediaFileSchema>
export type AddMediaFileTransformedValues = z.output<typeof addMediaFileSchema>
