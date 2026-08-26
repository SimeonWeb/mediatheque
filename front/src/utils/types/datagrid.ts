import type { CellData, Column, Row, RowData, TableFeatures } from "@tanstack/react-table"

import type { NavigationElement, NavigationElementInteractive } from "./navigation"
// import type { Icons } from "./icons"

declare module "@tanstack/react-table" {
	interface ColumnMeta<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = unknown> {
		className?: string | ((column: Column<TFeatures, TData, TValue>) => string)
		responsiveClassName?: string | ((column: Column<TFeatures, TData, TValue>) => string)
		// intent?: string | ((column: Column<TData, TValue>) => string)
	}
}

export type RowActionsMethod<in out TFeatures extends TableFeatures, in out TData extends RowData> = (row: Row<TFeatures, TData>) => [
	(
		NavigationElementInteractive
		// & {
		// 	icon?: Icons
		// }
	)[],
	NavigationElement[],
]

export type RowActionsProps<in out TFeatures extends TableFeatures, in out TData extends RowData> = {
	actions?: RowActionsMethod<TFeatures, TData>
	row: Row<TFeatures, TData>
}
