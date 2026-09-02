import type { PropsWithChildren, PropsWithClassName } from "react"

import { cn } from "@/utils/cn"

import { Icon } from "./Icon"
import { Loader } from "./Loader"

export type WithLoadingProps = PropsWithChildren<PropsWithClassName<{
	isLoading?: boolean
	isSuccess?: boolean
	containerClassName?: string
}>>

export const WithLoading = ({ isLoading, isSuccess, children, containerClassName, className }: WithLoadingProps) => {
	return (
		<span
			className={cn("flex relative", containerClassName)}
			aria-label={isLoading ? "Chargement..." : undefined}
		>
			<span
				className={cn(
					"flex items-center justify-center",
					"transition duration-150",
					{
						"opacity-0 scale-90": isLoading || isSuccess,
					},
					className
				)}
			>
				{children}
			</span>
			<Loader
				className={cn(
					"absolute left-1/2 top-1/2 -translate-1/2",
					"transition-opacity duration-150",
					"pointer-events-none",
					{
						"opacity-0": !isLoading || isSuccess,
					},
				)}
			/>
			<Icon
				name="check"
				className={cn(
					"absolute left-1/2 top-1/2 -translate-1/2",
					"transition",
					"pointer-events-none",
					isSuccess
						? "opacity-100 scale-150 duration-300"
						: "opacity-0 scale-50 duration-150"
				)}
			/>
		</span>
	)
}
