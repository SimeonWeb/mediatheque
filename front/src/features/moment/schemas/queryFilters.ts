import { z } from "zod"

export const momentsQueryFiltersSchema = z.object({

})

export type MomentsQueryFilters = z.output<typeof momentsQueryFiltersSchema>
