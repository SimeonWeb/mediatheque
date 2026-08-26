import { z } from "zod"

export const mediaTypesQueryFiltersSchema = z.object({

})

export type MediaTypesQueryFilters = z.output<typeof mediaTypesQueryFiltersSchema>
