import { Outlet, useNavigate } from "@tanstack/react-router"

import { DialogsProvider } from "@/components/DialogsProvider"

import { Navbar } from "./Navbar"
import { useEffect } from "react"

export const RootComponent = () => {
	const navigate = useNavigate()

	useEffect(
		() => {
			navigate({
				to: ".",
				search: prev => ({ ...prev, token: undefined }),
				replace: true,
			})
		},
		[navigate]
	)

	return (
		<>
			<Navbar />
			<main className="flex flex-col min-h-full is-vertical:pb-16 is-horizontal:pl-16 lg:is-horizontal:pl-[6vw]">
				<Outlet />
			</main>
			<DialogsProvider />
		</>
	)
}
