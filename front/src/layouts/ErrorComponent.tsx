import { type ErrorComponentProps } from "@tanstack/react-router"

import { Alert } from "@/components/Alert"

import { Header } from "./Header"
import { HomeComponent } from "./HomeComponent"

export const ErrorComponent = ({ error }: ErrorComponentProps) => {
	return (
		<>
			<Header />
			<main className="flex flex-col min-h-full is-vertical:pb-16 is-horizontal:pl-16 lg:is-horizontal:pl-[6vw]">
				<HomeComponent />
			</main>
			<div
				className="fixed bottom-4 is-vertical:inset-x-4 w-auto z-30 is-horizontal:top-[2.5vw] is-horizontal:inset-x-[2.5vw]"
			>
				{typeof error.cause === "object" && error.cause !== null && "status" in error.cause && error.cause.status === 401
					? (
						<Alert title="Trop tard...">
							<p>Utilisez le lien qui vous a été fourni pour accéder au contenu</p>
						</Alert>
					)
					: <Alert title={error.message} />
				}
			</div>
		</>
	)
}
