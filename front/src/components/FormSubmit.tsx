import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import type { Icons } from "@/utils/types/icons"
import { defaultSubmitLabel } from "@/utils/default"
import { findScrollContainer } from "@/utils/scroll"

import { Button, type ButtonProps } from "./Button"
import { WithIcon } from "./WithIcon"
import { WithLoading } from "./WithLoading"

export interface FormSubmitProps extends ButtonProps {
	icon?: Icons
	canSendDirty?: boolean
}

export const FormSubmit = ({ children, icon = "add", disabled, canSendDirty, ...props }: FormSubmitProps) => {
	const { formState: { isDirty, errors, isSubmitting, isSubmitSuccessful } } = useFormContext()

	// Focus on first error field
	useEffect(
		() => {
			const errorsArray = Object.entries(errors)

			if (errorsArray.length === 0) {
				return
			}

			const [key, value] = errorsArray[0]

			if (!value) {
				return
			}

			let elementId = key

			if (Array.isArray(value)) {
				const index = value.findIndex(error => !!error)

				if (index > -1) {
					const keyAtIndex = Object.keys(value[index])

					if (keyAtIndex[0]) {
						elementId = `${key}.${index}.${keyAtIndex[0]}`
					}
				}
			}

			const element = document.getElementById(elementId)

			if (!element) {
				return
			}

			const scrollContainer = findScrollContainer(element)
			let container = document.querySelector(".PageMain") as HTMLDivElement | null
			let scrollTop = 0
			let offset = 0

			if ("scrollTop" in scrollContainer) {
				container = scrollContainer.querySelector(".PageMain") as HTMLDivElement | null
				scrollTop = scrollContainer.scrollTop
			}

			if (container) {
				const containerStyle = getComputedStyle(container)
				const containerPadding = parseInt(containerStyle.paddingTop, 10)
				offset = containerPadding * 2 + container.offsetTop
			}

			const bounding = element.getBoundingClientRect()

			scrollContainer.scroll({ top: scrollTop + bounding.top - offset })
		},
		[errors]
	)

	return (
		<Button
			intent="primary"
			{...props}
			disabled={disabled || !isDirty && !canSendDirty}
			readOnly={isSubmitting || isSubmitSuccessful}
			type="submit"
		>
			<WithLoading isLoading={isSubmitting} isSuccess={isSubmitSuccessful}>
				<WithIcon after={icon}>{children || defaultSubmitLabel}</WithIcon>
			</WithLoading>
		</Button>
	)
}
