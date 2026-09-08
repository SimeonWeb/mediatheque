import { type ErrorComponentProps, useRouter } from "@tanstack/react-router"
import z from "zod"

import { Alert } from "@/components/Alert"
import { FieldAside } from "@/components/FieldAside"
import { Form } from "@/components/Form"
import { FormSubmit } from "@/components/FormSubmit"
import { InputFormField } from "@/components/InputFormField"
import { sleep } from "@/utils/sleep"
import { useAuth } from "@/stores/auth"
import { zf } from "@/utils/zod"

import { Header } from "./Header"
import { HomeComponent } from "./HomeComponent"

export const ErrorComponent = ({ error }: ErrorComponentProps) => {
	const router = useRouter()

	return (
		<>
			<Header />
			<main className="flex flex-col min-h-full is-vertical:pb-16 is-horizontal:pl-16 lg:is-horizontal:pl-[6vw]">
				<HomeComponent />
			</main>
			<div
				className="fixed bottom-4 is-vertical:inset-x-4 w-auto z-30 is-horizontal:top-[2.5vw] is-horizontal:inset-x-[2.5vw]"
			>
				{error.message === "Unauthorized"
					? (
						<Alert title="Vous ne pouvez pas accéder à ce contenu">
							<Form
								schema={z.object({
									token: zf.string("Token"),
								})}
								defaultValues={{
									token: "",
								}}
								onValid={async data => {
									useAuth.setState(data)
									await sleep(400)
								}}
								onValidated={async () => {
									await sleep(400)
									router.invalidate()
								}}
								className="w-full"
							>
								<InputFormField
									name="token"
									fieldClassName="[&_label]:sr-only"
									placeholder="Renseignez votre token"
									autoCapitalize="off"
									autoComplete="off"
									autoCorrect="off"
									after={
										<FieldAside isButton>
											<FormSubmit
												isNarrow
												icon="check"
												className="[&_.Icon+span]:sr-only"
											/>
										</FieldAside>
									}
								/>
							</Form>
						</Alert>
					)
					: <Alert title={error.message} />
				}
			</div>
		</>
	)
}
