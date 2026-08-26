import type { PropsWithClassName } from "react"
import { cn } from "@/utils/cn"

import { Icon } from "./Icon"

export type LoaderProps = PropsWithClassName

export const Loader = ({ className }: LoaderProps) => {
	return (
		<Icon
			name="loader"
			className={cn("animate-spin", className)}
		/>
	)
}
