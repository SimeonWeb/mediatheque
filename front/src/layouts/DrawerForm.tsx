import type { DefaultError } from "@tanstack/react-query"
import type { FieldValues } from "react-hook-form"
import type { ReactNode } from "react"
import type { RowData } from "@tanstack/react-table"

import { DrawerHeader, DrawerMain } from "@/layouts/Drawer"
import { Form, type FormProps } from "@/components/Form"
import { getEntityAddLabel, getEntityEditLabel } from "@/utils/labels"
import { Alert } from "@/components/Alert"
import type { EntityLabel } from "@/utils/types/entityLabel"
import { defaultErrorMessage } from "@/utils/default"

import { DrawerLoader } from "./DrawerLoader"

export interface DrawerFormProps<
	TData extends RowData,
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
	TError extends DefaultError = DefaultError,
> extends Omit<FormProps<TData, TFieldValues, TContext, TTransformedValues>, "title"> {
	entityLabel: EntityLabel
	error?: TError | null
	title?: ReactNode
	actions?: ReactNode
	isLoading?: boolean
}

export const DrawerForm = <
	TData extends RowData,
	TFieldValues extends FieldValues = FieldValues,
	TContext = unknown,
	TTransformedValues extends FieldValues = TFieldValues,
	TError extends DefaultError = DefaultError,
>({
	title,
	entityLabel,
	children,
	className,
	onValidated,
	actions,
	error,
	isLoading,
	...formProps
}: DrawerFormProps<TData, TFieldValues, TContext, TTransformedValues, TError>) => {
	if (isLoading) {
		return (
			<DrawerLoader
				title={title || (formProps.data ? getEntityEditLabel(entityLabel) : getEntityAddLabel(entityLabel))}
			/>
		)
	}

	return (
		<Form
			{...formProps}
			onValidated={async (data, methods) => {
				await onValidated?.(data, methods)
			}}
		>
			{props => (
				<>
					<DrawerHeader
						title={title || (formProps.data ? getEntityEditLabel(entityLabel) : getEntityAddLabel(entityLabel))}
						actions={actions}
					/>
					<DrawerMain>
						{error && (
							<Alert>
								{error instanceof Error ? error.message : defaultErrorMessage}
							</Alert>
						)}
						{typeof children === "function" ? children(props) : children}
					</DrawerMain>
				</>
			)}
		</Form>
	)
}
