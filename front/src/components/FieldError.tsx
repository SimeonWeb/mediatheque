import type { PropsWithChildren } from "react"

import { cn } from "@/utils/cn"

export type FieldErrorProps = PropsWithChildren

export const FieldError = ({ children }: FieldErrorProps) => {
	return !!children && (
		<p
			className={cn(
				"FieldError",
				"bg-error",
				"text-white",
				"outline-2 outline-error",
				"rounded-b-lg px-[.65em] pt-[1em] pb-[.5em] mt-[-.5em] text-xs",
			)}
		>
			{children}
		</p>
	)
}
