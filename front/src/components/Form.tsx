import { type FieldValues, FormProvider, type UseFormProps, useForm } from "react-hook-form"
import { type ComponentProps } from "react"
import type { RowData } from "@tanstack/react-table"
import { zodResolver } from "@hookform/resolvers/zod"

import type { ChildrenProps, EntityProps, SubmitProps, ValidationProps } from "@/utils/types/form"
import { FormMeta } from "@/contexts/FormMeta"
import { parseFormProps } from "@/utils/form"

export type FormProps<
	TData extends RowData = RowData,
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
> = (
	Omit<ComponentProps<"form">, "children" | "onSubmit" | "onValid" | "onInvalid">
	& ChildrenProps<TFieldValues, TContext, TTransformedValues>
	& UseFormProps<TFieldValues, TContext, TTransformedValues>
	& SubmitProps<TFieldValues, TContext, TTransformedValues>
	& EntityProps<TData>
	& ValidationProps<TFieldValues, TTransformedValues>
)

export const Form = <
	TData extends RowData = RowData,
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
>(props: FormProps<TData, TFieldValues, TContext, TTransformedValues>) => {
	const {
		useFormProps,
		submitProps: {
			onValid,
			onInvalid,
			onValidated,
		},
		entityProps: {
			data,
		},
		validationProps: {
			schema,
		},
		childrenProps: {
			children,
		},
		formProps,
	} = parseFormProps(props)

	const methods = useForm({
		...useFormProps,
		resolver: useFormProps.resolver || zodResolver(schema),
	})

	return (
		<FormMeta value={{ schema, data }}>
			<FormProvider {...methods}>
				<form
					{...formProps}
					onSubmit={methods.handleSubmit(
						async data => {
							const response = await onValid(data)
							if (onValidated) {
								onValidated(response, methods)
							}
						},
						onInvalid
					)}
				>
					{typeof children === "function" ? children({ methods }) : children}
				</form>
			</FormProvider>
		</FormMeta>
	)
}
