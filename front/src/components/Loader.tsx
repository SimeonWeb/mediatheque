import { type PropsWithClassName, useEffect, useState } from "react"
import { cn } from "@/utils/cn"

import { Icon } from "./Icon"

export type LoaderProps = PropsWithClassName

export const Loader = ({ className }: LoaderProps) => {
	const [show, setShow] = useState(false)

	useEffect(
		() => {
			const timer = setTimeout(
				() => setShow(true),
				1000
			)

			return () => {
				clearTimeout(timer)
			}
		},
		[]
	)

	return (
		<Icon
			name="loader"
			className={cn(
				"animate-spin",
				{
					"hidden": !show,
				},
				className
			)}
		/>
	)
}
