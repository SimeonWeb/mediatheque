import { createFileRoute } from "@tanstack/react-router"

import { MediaTypeComponent } from "@/features/mediaType/components/MediaTypeComponent"

export const Route = createFileRoute("/$mediaType")({
	component: MediaTypeComponent,
})
