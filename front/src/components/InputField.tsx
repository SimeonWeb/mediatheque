import type { FieldProps } from "@/utils/types/form"
import { cn } from "@/utils/cn"

import { Input, type InputProps } from "./Input"
import { FieldWrapper } from "./FieldWrapper"

export type InputFieldProps = InputProps & FieldProps

export const InputField = ({
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
}: InputFieldProps) => (
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
		<Input
			{...props}
			id={id || name}
			name={name}
			className={cn("FieldInput", className)}
		/>
		{after}
	</FieldWrapper>
)
