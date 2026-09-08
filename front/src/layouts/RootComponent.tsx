import { Outlet, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"

import { DialogsProvider } from "@/components/DialogsProvider"

import { AudioPlayerGlobal } from "./AudioPlayerGlobal"
import { Navbar } from "./Navbar"

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
			<AudioPlayerGlobal />
			<main className="flex flex-col min-h-full is-vertical:pb-16 is-horizontal:pl-16 lg:is-horizontal:pl-[6vw]">
				<Outlet />
			</main>
			<DialogsProvider />
		</>
	)
}
