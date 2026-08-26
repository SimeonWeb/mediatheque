import { createRootRoute, stripSearchParams } from "@tanstack/react-router"
import z from "zod"

import { RootComponent } from "@/layouts/RootComponent"
import { mediaTypesQueryOptions } from "@/features/mediaType/api/options"
import { useAuth } from "@/stores/auth"

export const Route = createRootRoute({
	validateSearch: z.object({
		token: z.string().optional(),
	}),
	search: {
		middlewares: [stripSearchParams(true)],
	},
	beforeLoad: () => {
		if (!useAuth.getState().hasToken()) {
			throw Error("Pas de token")
		}
	},
	loader: async ({ context: { queryClient } }) => (
		await queryClient.ensureQueryData(mediaTypesQueryOptions())
	),
	component: RootComponent,
})
