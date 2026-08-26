import { Outlet } from "@tanstack/react-router"

import { DialogsProvider } from "@/components/DialogsProvider"
import { MediaFilesProvider } from "@/features/mediaFile/utils/MediaFilesProvider"

import { Navbar } from "./Navbar"

export const RootComponent = () => {
	return (
		<MediaFilesProvider>
			<Navbar />
			<main className="flex flex-col min-h-full is-vertical:pb-16 is-horizontal:pl-16 lg:is-horizontal:pl-[6vw]">
				<Outlet />
			</main>
			<DialogsProvider />
		</MediaFilesProvider>
	)
}
