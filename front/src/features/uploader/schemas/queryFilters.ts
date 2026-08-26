import { z } from "zod"

export const uploadersQueryFiltersSchema = z.object({

})

export type UploadersQueryFilters = z.output<typeof uploadersQueryFiltersSchema>
