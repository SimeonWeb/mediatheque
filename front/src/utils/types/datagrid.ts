import type { Column, Row, RowData } from "@tanstack/react-table"

import type { ButtonProps, ExternalLinkButtonProps, LinkButtonProps } from "@/components/Button"

import type { Icons } from "./icons"
import type { NavigationElement } from "./navigation"

declare module "@tanstack/react-table" {
	interface ColumnMeta<TData extends RowData, TValue> {
		className?: string | ((column: Column<TData, TValue>) => string)
		responsiveClassName?: string | ((column: Column<TData, TValue>) => string)
		// intent?: string | ((column: Column<TData, TValue>) => string)
	}
}

export type RowActionsMethod<D extends RowData> = (row: Row<D>) => [
	(
		(
			ButtonProps
			| LinkButtonProps
			| ExternalLinkButtonProps
		)
		& {
			icon?: Icons
		}
	)[],
	NavigationElement[],
]

export type RowActionsProps<D extends RowData> = {
	actions?: RowActionsMethod<D>
	row: Row<D>
	isNarrow?: boolean
}
