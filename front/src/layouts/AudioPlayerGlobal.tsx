import { useEffect } from "react"

import { AudioPlayerMini } from "@/components/Player"
import { Icon } from "@/components/Icon"
import { WithIcon } from "@/components/WithIcon"
import { cn } from "@/utils/cn"
import { openDialog } from "@/utils/dialogs"
import { useAuth } from "@/stores/auth"
import { useDialog } from "@/stores/dialog"
import { useUser } from "@/stores/user"

export const AudioPlayerGlobal = () => {
	const isReady = useUser(state => state.isReady)
	const hasToken = useAuth(state => !!state.token)
	const canUpload = useAuth(state => state.canUpload)

	useEffect(
		() => {
			if (!hasToken) {
				return
			}

			openDialog(
				<WithIcon before="home" containerClassName="text-7xl text-accent starting:opacity-0 starting:scale-75 transition duration-500" className="sr-only">Bienvenue</WithIcon>,
				<>
					<p className="translate-0 starting:opacity-0 starting:-translate-y-2 duration-500 delay-500">
						{canUpload()
							? "Merci d'avoir été là pour cette superbe journée. Voici quelques souvenirs, n'hésitez pas à y ajouter les votres."
							: "Merci d'avoir été là pour cette superbe journée, voici quelques souvenirs."
						}
					</p>
					<p className="translate-0 starting:opacity-0 starting:-translate-y-2 duration-500 delay-800">Bisous</p>
					<p className="starting:opacity-0 starting:-rotate-6 starting:scale-120 transition delay-1300 duration-400">
						<button
							onClick={() => useDialog.getState().close()}
							className="rounded-full outline-2 outline-offset-2 outline-transparent focus-visible:outline-primary/80"
						>
							<Icon name="ink-pad" className="size-36 text-primary" label="Marie et Simon" />
						</button>
					</p>
				</>,
				{
					button: <WithIcon before="x" containerClassName="starting:opacity-0 transition delay-2200 duration-700" className="sr-only">Fermer</WithIcon>,
					containerClassName: "[&_.DialogBackdrop]:bg-white",
				},
				{
					onClose: () => useUser.setState({ isReady: true }),
				}
			)
		},
		[canUpload, hasToken]
	)

	return isReady && (
		<div
			className={cn(
				"fixed top-4 right-4 is-horizontal:top-[3.5vw] is-horizontal:right-[3.5vw] ",
				"bg-white/60 backdrop-blur-xl",
				"shadow-[0_1rem_2rem_var(--tw-shadow-color)] shadow-black/10",
				"w-auto rounded-full z-30"
			)}
		>
			<AudioPlayerMini
				initPlayer={useUser.getState().initPlayer}
				src="/assets/Chouchout(e)ries.mp3"
				className="bg-transparent text-current text-xl"
				autoPlay
			/>
		</div>
	)
}
