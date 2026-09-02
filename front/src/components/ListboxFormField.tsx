import { Controller, useFormContext } from "react-hook-form"

import type { WithName } from "@/utils/types/form"
import { getSchemaFieldProps } from "@/utils/react-hook-form"
import { useFormMeta } from "@/contexts/useFormMeta"

import { ListboxField, type ListboxFieldProps } from "./ListboxField"
import type { OptionValue } from "./Listbox"

export type ListboxFormFieldProps<
	TValue extends OptionValue,
	TMultiple extends boolean = false,
> = WithName<Omit<ListboxFieldProps<TValue, TMultiple>, "value" | "defaultValue" | "onChange">>

export const ListboxFormField = <
	TValue extends OptionValue,
	TMultiple extends boolean = false,
>(props: ListboxFormFieldProps<TValue, TMultiple>) => {
	const { setValue } = useFormContext()
	const { schema } = useFormMeta()
	const schemaProps = getSchemaFieldProps<ListboxFieldProps<TValue, TMultiple>>(props.name, schema)

	return (
		<Controller
			name={props.name}
			render={({ field, fieldState: { error } }) => (
				<ListboxField
					{...field}
					isClearable={schemaProps.isOptional}
					onSelected={option => {
						setValue(
							props.name,
							Array.isArray(option)
								? option.map(({ value }) => value)
								: option?.value || null,
							{ shouldDirty: true }
						)
					}}
					{...schemaProps}
					{...props}
					error={error?.message}
				/>
			)}
		/>
	)
}
