import { fetchToJson } from "@/utils/fetch"

import type { RoleItem } from "./types"

export const getRole = (init?: RequestInit) => (
	fetchToJson<RoleItem>(
		`/role`,
		init
	)
)
