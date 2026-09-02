import type { ReactNode } from "react"

import { DrawerHeader, DrawerMain } from "@/layouts/Drawer"
import { Loader } from "@/components/Loader"

export interface DrawerFormProps {
	title?: ReactNode
}

export const DrawerLoader = ({
	title,
}: DrawerFormProps) => {
	return (
		<>
			<DrawerHeader
				title={title}
			/>
			<DrawerMain className="justify-center items-center">
				<Loader />
			</DrawerMain>
		</>
	)
}
