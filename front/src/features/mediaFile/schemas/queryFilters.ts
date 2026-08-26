import { z } from "zod"

export const mediaFilesQueryFiltersSchema = z.object({
	uploader: z.string().optional(),
	type: z.string().optional(),
	"sort[createdAt]": z.enum(["ASC", "DESC"]).optional(),
})

export type MediaFilesQueryFilters = z.output<typeof mediaFilesQueryFiltersSchema>
