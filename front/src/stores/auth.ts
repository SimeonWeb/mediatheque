import { create } from "zustand"
import { persist } from "zustand/middleware"

export type AuthState = {
	token: string | null
}

export type AuthActions = {
	hasToken: () => boolean
	setToken: (token: string | null) => void
}

export const useAuth = create<AuthState & AuthActions>()(
	persist(
		(set, get) => ({
			token: localStorage.getItem("token"),
			hasToken: () => {
				const params = new URLSearchParams(window.location.search)

				if (params.has("token")) {
					get().setToken(params.get("token"))
					return true
				}

				return !!get().token
			},
			setToken: token => {
				if (token) {
					set({ token })

					return
				}

				set({ token: null })
			},
		}),
		{
			name: "auth",
			partialize: state => ({
				token: state.token,
			}),
		}
	),
)
