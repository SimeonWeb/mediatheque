import { createFileRoute } from "@tanstack/react-router"

import { MediaTypeComponent } from "@/features/mediaType/components/MediaTypeComponent"
import z from "zod"

export const Route = createFileRoute("/$mediaType")({
	validateSearch: z.object({
		uploader: z.string().optional(),
	}),
	component: MediaTypeComponent,
})
