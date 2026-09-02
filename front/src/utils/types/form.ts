import type { ComponentProps, ReactNode } from "react"
import type { FieldValues, SubmitErrorHandler, SubmitHandler, UseFormReturn } from "react-hook-form"
import type { RowData } from "@tanstack/react-table"
import type { ZodType } from "zod"

export type FieldProps = {
	label?: React.ReactNode
	isOptional?: boolean
	description?: React.ReactNode
	error?: string
	before?: React.ReactNode
	after?: React.ReactNode
	fieldClassName?: string
	controlClassName?: string
	type?: ComponentProps<"input">["type"]
}

export type WithName<P> = P & {
	name: string
}

export type SubmitProps<
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
> = {
	onValid: SubmitHandler<TTransformedValues>
	onInvalid?: SubmitErrorHandler<TFieldValues>
	onValidated?: (data: unknown, methods: UseFormReturn<TFieldValues, TContext, TTransformedValues>) => void | Promise<void>
}

export type EntityProps<
	TData extends RowData,
> = {
	data?: TData | undefined
}

export type ValidationProps<
	TFieldValues extends FieldValues = FieldValues,
	TTransformedValues extends FieldValues = TFieldValues,
> = {
	schema: ZodType<TTransformedValues, TFieldValues>
}

export type FormChildrenProps<
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
> = {
	methods: UseFormReturn<TFieldValues, TContext, TTransformedValues>
}

export type ChildrenProps<
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
> = {
	children: ReactNode | ((props: FormChildrenProps<TFieldValues, TContext, TTransformedValues>) => ReactNode)
}

export type FormValue<V = unknown> = V | ""

export type FormValues<TFieldValues extends FieldValues = FieldValues> = Record<keyof TFieldValues, FormValue<TFieldValues[keyof TFieldValues]>>
