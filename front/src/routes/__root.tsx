import { createRootRoute } from "@tanstack/react-router"
import z from "zod"

import { ErrorComponent } from "@/layouts/ErrorComponent"
import { RootComponent } from "@/layouts/RootComponent"
import { mediaTypesQueryOptions } from "@/features/mediaType/api/options"
import { useAuth } from "@/stores/auth"

export const Route = createRootRoute({
	validateSearch: z.object({
		token: z.string().optional(),
	}),
	beforeLoad: async () => {
		await useAuth.getState().init()
	},
	loader: async ({ context: { queryClient } }) => (
		await queryClient.ensureQueryData(mediaTypesQueryOptions())
	),
	component: RootComponent,
	errorComponent: ErrorComponent,
})
