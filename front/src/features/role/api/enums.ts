import type { TypeFromArrayConst } from "@/utils/types"

export const role = [
	"UPLOAD_ALL",
	"UPLOAD",
	"READ",
] as const

export type Role = TypeFromArrayConst<typeof role>
