import type { FieldProps } from "@/utils/types/form"
import { cn } from "@/utils/cn"

import { Listbox, type ListboxProps, type OptionValue } from "./Listbox"
import { FieldWrapper } from "./FieldWrapper"

export type ListboxFieldProps<
	TValue extends OptionValue,
	TMultiple extends boolean = false,
> = ListboxProps<TValue, TMultiple> & FieldProps

export const ListboxField = <
	TValue extends OptionValue,
	TMultiple extends boolean = false,
>({
	id,
	name,
	label,
	isOptional,
	description,
	error,
	before,
	after,
	size,
	intent,
	rounded,
	fieldClassName,
	controlClassName,
	className,
	...props
}: ListboxFieldProps<TValue, TMultiple>) => (
	<FieldWrapper
		htmlFor={id || name}
		label={label}
		isOptional={isOptional}
		isReadOnly={props.readOnly}
		isDisabled={props.disabled}
		description={description}
		error={error}
		size={size}
		intent={intent}
		rounded={rounded}
		className={fieldClassName}
		controlClassName={controlClassName}
	>
		{before}
		<Listbox
			{...props}
			id={id || name}
			name={name}
			className={cn("FieldInput", className)}
		/>
		{after}
	</FieldWrapper>
)
