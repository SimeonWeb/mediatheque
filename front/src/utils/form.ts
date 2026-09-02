import type { FieldValues, UseFormProps, UseFormReturn } from "react-hook-form"
import type { FormProps } from "@/components/Form"
import type { RowData } from "@tanstack/react-table"
import { z } from "zod"

import type { ChildrenProps, EntityProps, SubmitProps, ValidationProps } from "./types/form"
import { omit } from "./object"

export const searchSchema = z.object({
})

export const formExcludedFromRetainSearchParams = []

export type SearchSchema = z.infer<typeof searchSchema>

export const isNewForm = () => (
	!!(new URLSearchParams(window.location.search).get("new"))
)

export const parseFormMethods = <
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
>({
	watch,
	getValues,
	getFieldState,
	setError,
	clearErrors,
	setValue,
	trigger,
	formState,
	resetField,
	reset,
	handleSubmit,
	unregister,
	control,
	register,
	setFocus,
	subscribe,
}: UseFormReturn<TFieldValues, TContext, TTransformedValues>) => ({
	watch,
	getValues,
	getFieldState,
	setError,
	clearErrors,
	setValue,
	trigger,
	formState,
	resetField,
	reset,
	handleSubmit,
	unregister,
	control,
	register,
	setFocus,
	subscribe,
})

export const parseUseFormProps = <
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
>({
	mode,
	disabled,
	reValidateMode,
	defaultValues,
	values,
	errors,
	resetOptions,
	resolver,
	context,
	shouldFocusError,
	shouldUnregister,
	shouldUseNativeValidation,
	progressive,
	criteriaMode,
	delayError,
	formControl,
}: UseFormProps<TFieldValues, TContext, TTransformedValues>) => ({
	mode,
	disabled,
	reValidateMode,
	defaultValues,
	values,
	errors,
	resetOptions,
	resolver,
	context,
	shouldFocusError,
	shouldUnregister,
	shouldUseNativeValidation,
	progressive,
	criteriaMode,
	delayError,
	formControl,
})

export const parseSubmitProps = <
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
>({
	onValid,
	onInvalid,
	onValidated,
}: SubmitProps<TFieldValues, TContext, TTransformedValues>) => ({
	onValid,
	onInvalid,
	onValidated,
})

export const parseEntityProps = <
	TData extends RowData,
>({
	data,
}: EntityProps<TData>) => ({
	data,
})

export const parseValidationProps = <
	TFieldValues extends FieldValues = FieldValues,
	TTransformedValues extends FieldValues = TFieldValues,
>({
	schema,
}: ValidationProps<TFieldValues, TTransformedValues>) => ({
	schema,
})

export const parseChildrenProps = <
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
>({
	children,
}: ChildrenProps<TFieldValues, TContext, TTransformedValues>) => ({
	children,
})

export const parseFormProps = <
	TData extends RowData,
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
>(props: FormProps<TData, TFieldValues, TContext, TTransformedValues>) => {
	const useFormProps = parseUseFormProps(props)
	const submitProps = parseSubmitProps(props)
	const entityProps = parseEntityProps(props)
	const validationProps = parseValidationProps(props)
	const childrenProps = parseChildrenProps(props)

	const omitEntries = { ...useFormProps, ...submitProps, ...entityProps, ...validationProps, ...childrenProps }

	return {
		useFormProps,
		submitProps,
		entityProps,
		validationProps,
		childrenProps,
		formProps: omit(props, Object.keys(omitEntries) as (keyof typeof omitEntries)[]),
	}
}
