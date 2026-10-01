import { createRootRouteWithContext } from "@tanstack/react-router"
import z from "zod"

import type { AppQueryClient } from "@/utils/queryClient"
import { ErrorComponent } from "@/layouts/ErrorComponent"
import { RootComponent } from "@/layouts/RootComponent"
import { mediaTypesQueryOptions } from "@/features/mediaType/api/options"
import { momentsQueryOptions } from "@/features/moment/api/options"
import { useAuth } from "@/stores/auth"

export const Route = createRootRouteWithContext<{
	queryClient: AppQueryClient
}>()({
	validateSearch: z.object({
		token: z.string().optional(),
	}),
	beforeLoad: async () => {
		await useAuth.getState().init()
	},
	loader: async ({ context: { queryClient } }) => (
		await Promise.all([
			queryClient.ensureQueryData(mediaTypesQueryOptions()),
			queryClient.ensureQueryData(momentsQueryOptions()),
		])
	),
	component: RootComponent,
	errorComponent: ErrorComponent,
})
