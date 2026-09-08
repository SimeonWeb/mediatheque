import type { TypeParams } from "zod/v4/core"
import { fr } from "zod/locales"
import z from "zod"

import { dateToIsoDate, timeToMinutes } from "./zod-codecs"

export const zodInit = () => {
	z.config(fr())
}

const makeZfSchema = <
	TSchema extends z.ZodType = z.ZodType,
	TParams extends string | TypeParams<TSchema> = string | TypeParams<TSchema>,
>(
	schema: (params?: TParams) => TSchema,
) => (
	label: string,
	optional?: boolean,
	checks?: (schema: NoInfer<TSchema>) => NoInfer<TSchema>,
	params?: NoInfer<TParams>
) => {
	let improvedSchema = schema(params)

	if (checks) {
		improvedSchema = checks(improvedSchema)
	}

	return improvedSchema
		.meta({
			title: label,
			isOptional: optional,
		})
		.nullable()
		.refine(value => !optional ? value !== null : true)
}

const makeZfArraySchema = <
	TSchema extends z.ZodType = z.ZodType,
	TParams extends string | TypeParams<z.ZodArray<TSchema>> = string | TypeParams<z.ZodArray<TSchema>>,
>(
	schema: TSchema,
) => (
	label: string,
	optional?: boolean,
	checks?: (schema: z.ZodArray<TSchema>) => z.ZodArray<TSchema>,
	params?: NoInfer<TParams>
) => {
	let improvedSchema = z.array(schema, params)

	if (checks) {
		improvedSchema = checks(improvedSchema)
	}

	return improvedSchema
		.refine(value => !optional ? value !== null && value.length > 0 : true)
		.meta({
			title: label,
			isOptional: optional,
		})
}

const zfDateSchema = (
	label: string,
	optional?: boolean,
	checks?: (schema: NoInfer<z.ZodDate>) => NoInfer<z.ZodDate>,
	params?: NoInfer<string | TypeParams<z.ZodDate>>
) => {
	let improvedSchema = z.date(params)

	if (checks) {
		improvedSchema = checks(improvedSchema)
	}

	return improvedSchema
		.meta({
			title: label,
			isOptional: optional,
		})
		.nullable()
		.refine(value => !optional ? value !== null : true)
		.transform(value => dateToIsoDate.decode(value))
}

const zfEnumSchema = <
	T extends readonly string[],
>(
	values: T,
	label: string,
	optional?: boolean,
	checks?: (schema: NoInfer<z.ZodEnum>) => NoInfer<z.ZodEnum>,
	params?: NoInfer<string | TypeParams<z.ZodEnum>>
) => {
	let improvedSchema = z.enum(values, params)

	if (checks) {
		// @ts-expect-error bad schema
		improvedSchema = checks(improvedSchema)
	}

	return improvedSchema
		.meta({
			title: label,
			isOptional: optional,
		})
		.nullable()
		.refine(value => !optional ? value !== null : true)
}

const zfTimeSchema = (
	label: string,
	optional?: boolean,
	checks?: (schema: NoInfer<z.ZodISOTime>) => NoInfer<z.ZodISOTime>,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params?: any
) => {
	let improvedSchema = z.iso.time(params)

	if (checks) {
		improvedSchema = checks(improvedSchema)
	}

	return improvedSchema
		.meta({
			title: label,
			isOptional: optional,
		})
		.nullable()
		.refine(value => !optional ? value !== null : true)
		.transform(value => timeToMinutes.decode(value))
}

export const zf = {
	string: makeZfSchema<z.ZodString>(z.string),
	email: makeZfSchema(z.email),
	number: makeZfSchema(z.number),
	date: zfDateSchema,
	boolean: makeZfSchema(z.boolean),
	enum: zfEnumSchema,
	time: zfTimeSchema,
	file: makeZfSchema(z.file),

	stringArray: makeZfArraySchema(z.string()),
	numberArray: makeZfArraySchema(z.number()),
}
