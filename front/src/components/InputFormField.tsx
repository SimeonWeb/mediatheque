import { Controller } from "react-hook-form"

import { getSchemaFieldProps, prepareInputFieldProps } from "@/utils/react-hook-form"
import type { WithName } from "@/utils/types/form"
import { useFormMeta } from "@/contexts/useFormMeta"

import { InputField, type InputFieldProps } from "./InputField"

export type InputFormFieldProps = WithName<Omit<InputFieldProps, "value" | "defaultValue">>

export const InputFormField = (props: InputFormFieldProps) => {
	const { schema } = useFormMeta()
	const schemaProps = getSchemaFieldProps(props.name, schema)

	return (
		<Controller
			name={props.name}
			render={({ field, fieldState: { error } }) => (
				<InputField
					{...prepareInputFieldProps(field, schemaProps.type)}
					{...schemaProps}
					{...props}
					error={error?.message}
				/>
			)}
		/>
	)
}
