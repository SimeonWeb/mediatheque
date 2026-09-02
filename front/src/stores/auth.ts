import { createJSONStorage, persist, subscribeWithSelector } from "zustand/middleware"
import { create } from "zustand"

import type { Role } from "@/features/role/api/enums"
import { queryClient } from "@/utils/queryClient"
import { roleQueryOptions } from "@/features/role/api/options"

export type AuthState = {
	token: string | null
	role: Role | null
}

export type AuthActions = {
	init: () => Promise<void>
	canUpload: (all?: boolean) => boolean
}

export const useAuth = create<AuthState & AuthActions>()(
	persist(
		subscribeWithSelector(
			(set, get) => ({
				token: null,
				role: null,
				init: async () => {
					const params = new URLSearchParams(window.location.search)
					const token = params.get("token") || get().token

					if (token) {
						set({ token })

						const data = await queryClient.fetchQuery(roleQueryOptions())

						if (data.role) {
							set({ role: data.role })

							return
						}

						set({ token: null, role: null })
					}
				},
				canUpload: all => {
					if (all && get().role === "UPLOAD_ALL") {
						return true
					}

					return get().role === "UPLOAD"
				},
			}),
		),
		{
			name: "auth",
			partialize: state => ({
				token: state.token,
			}),
			storage: createJSONStorage(() => sessionStorage),
		}
	),
)
