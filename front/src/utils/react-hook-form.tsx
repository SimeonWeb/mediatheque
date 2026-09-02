import type { ChangeEvent, ComponentProps } from "react"
import { type ControllerRenderProps, type FieldPath, type FieldValues, get } from "react-hook-form"
import z from "zod"

import type { InputFieldProps } from "@/components/InputField"
import type { InputProps } from "@/components/Input"
import type { ListboxFieldProps } from "@/components/ListboxField"
import type { OptionValue } from "@/components/Listbox"

import { dateToIsoDate, numberOrNullToString, stringOrNullToString } from "./zod-codecs"
import type { FieldProps } from "./types/form"

declare module "zod" {
	interface GlobalMeta {
		isOptional?: boolean
	}
}

type AvailableSchema = (
	// Primary
	| z.ZodString
	| z.ZodDate
	| z.ZodNumber
	| z.ZodInt
	| z.ZodBoolean
	| z.ZodEmail
	| z.ZodPipe
	| z.ZodArray<z.ZodString>
	| z.ZodArray<z.ZodNumber>
	| z.ZodFile

	// Optional
	| z.ZodNullable
)

const getTransfromCodec = (type: ComponentProps<"input">["type"]) => {
	switch (type) {
		case "date":
			return dateToIsoDate
		case "number":
			return numberOrNullToString
		case "time":
		case "text":
			return stringOrNullToString
	}
}

export const prepareFieldProps = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
	fieldProps: ControllerRenderProps<TFieldValues, TName>,
	type: ComponentProps<"input">["type"] = "text"
) => {
	const codec = getTransfromCodec(type)

	if (!codec) {
		return fieldProps
	}

	return {
		...fieldProps,
		onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			fieldProps.onChange(codec.encode(event.target.value))
		},
		value: codec.decode(fieldProps.value),
	}
}

export const prepareInputFieldProps = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
	fieldProps: ControllerRenderProps<TFieldValues, TName>,
	type: ComponentProps<"input">["type"] = "text"
) => {
	if (type === "file") {
		return {
			...fieldProps,
			onChange: (event: ChangeEvent<HTMLInputElement>) => {
				fieldProps.onChange(event.target.files![0])
			},
			// TODO write fakepath properly
			value: (fieldProps.value as unknown) instanceof File ? `C:\\fakepath\\${fieldProps.value.name}` : "",
		}
	}

	return prepareFieldProps(fieldProps, type)
}

/**
 * Make iso zod checks & element props to trigger html field errors
 */
export const getCheckProps = (schema: AvailableSchema) => {
	const props = {} as InputProps

	if (!schema.def.checks || schema.def.checks.length === 0) {
		return props
	}

	for (const check of schema.def.checks) {
		switch (check._zod.def.check) {
			case "multiple_of": {
				const { value } = check._zod.def as z.core.$ZodCheckMultipleOfDef
				props.step = Number(value)
				break
			}
			case "greater_than": {
				const { value, inclusive } = check._zod.def as z.core.$ZodCheckGreaterThanDef
				if (schema.def.type === "date") {
					props.min = dateToIsoDate.decode(value as Date)
				} else {
					props.min = Number(value) - (inclusive ? 1 : 0)
				}
				break
			}
			case "less_than": {
				const { value, inclusive } = check._zod.def as z.core.$ZodCheckLessThanDef
				if (schema.def.type === "date") {
					props.max = dateToIsoDate.decode(value as Date)
				} else {
					props.max = Number(value) + (inclusive ? 1 : 0)
				}
				break
			}
			case "max_length":
				props.maxLength = (check._zod.def as z.core.$ZodCheckMaxLengthDef).maximum
				break
			case "min_length":
				props.minLength = (check._zod.def as z.core.$ZodCheckMinLengthDef).minimum
				break
			case "mime_type":
				props.accept = (check._zod.def as z.core.$ZodCheckMimeTypeDef).mime.toString()
				break
		}
	}

	return props
}

const getFieldSchema = (name: string, schema: z.ZodType): AvailableSchema | undefined => {
	const fieldsSchema = getTypeSchema(schema)

	if (!("shape" in fieldsSchema)) {
		return undefined
	}

	const fieldSchema = get(fieldsSchema.shape, name)

	if (fieldSchema) {
		return fieldSchema
	}

	const parts = name.split(".")

	if (parts.length === 1) {
		return undefined
	}

	const parentFieldSchema = get(fieldsSchema.shape, parts[0])

	if (parentFieldSchema.type === "array") {
		// part[1] is index
		return get(parentFieldSchema.element.shape, parts[2])
	}
}

const getTypeSchema = (schema: z.ZodType): z.ZodType => {
	if (schema.type === "pipe" || schema.type === "nullable") {
		if ("in" in schema.def) {
			return getTypeSchema(schema.def.in as z.ZodType)
		}

		if ("innerType" in schema.def) {
			return schema.def.innerType as z.ZodType
		}
	}

	return schema
}

const getFieldPropsFromSchema = (schema: AvailableSchema): Omit<FieldProps | InputFieldProps, "name"> | Omit<ListboxFieldProps<OptionValue, true>, "name" | "options"> => {
	const fieldSchema = getTypeSchema(schema) as AvailableSchema
	const fieldMeta = fieldSchema.meta()

	const baseProps = {
		label: fieldMeta?.title,
		isOptional: fieldMeta?.isOptional,
	} satisfies Omit<FieldProps, "name">

	switch (fieldSchema.type) {
		case "string": {
			switch (fieldSchema.format) {
				case "time":
					return {
						...baseProps,
						type: "time",
						...getCheckProps(fieldSchema),
					} satisfies Omit<InputFieldProps, "name">
				default:
					return baseProps
			}
		}
		case "array":
			return {
				...baseProps,
				multiple: true,
			} satisfies Omit<ListboxFieldProps<OptionValue, true>, "name" | "options">
		case "number":
			return {
				...baseProps,
				type: "number",
			} satisfies Omit<InputFieldProps, "name">
		case "date":
			return {
				...baseProps,
				type: "date",
				...getCheckProps(fieldSchema),
			} satisfies Omit<InputFieldProps, "name">
		case "file":
			return {
				...baseProps,
				type: "file",
				...getCheckProps(fieldSchema),
			} satisfies Omit<InputFieldProps, "name">
		default:
			return baseProps
	}
}

export const getSchemaFieldProps = <
	TFieldProps extends FieldProps = InputFieldProps,
>(name: string, schema: z.ZodType) => {
	const fieldSchema = getFieldSchema(name, schema)

	if (!fieldSchema) {
		return {} as Omit<TFieldProps, "name">
	}

	return getFieldPropsFromSchema(fieldSchema) as Omit<TFieldProps, "name">
}
