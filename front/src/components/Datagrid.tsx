import {
	type OnChangeFn,
	type PaginationOptions,
	type PaginationState,
	type RowData,
	type SortingState,
	type Table as TTable,
	type TableOptions,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table"
import { type PropsWithClassName, type ReactNode } from "react"
import { cva } from "class-variance-authority"

import type { RowActionsMethod, RowActionsProps } from "@/utils/types/datagrid"
import { defaultNoDataLabel, renderFallbackValue } from "@/utils/default"
import { getColumnClassName, getColumnResponsiveClassName, getDefaultRowCount, useCellEvents } from "@/utils/datagrid"
import { isExternalLinkButton, isLinkButton } from "@/utils/button"
import type { EntityLabel } from "@/utils/types/entityLabel"
import type { Icons } from "@/utils/types/icons"
import { cn } from "@/utils/cn"
import { getEntityNoDataLabel } from "@/utils/labels"

import { Button, type ButtonProps, ExternalLinkButton, LinkButton } from "./Button"
import { Cell, Head, Row, TBody, THead, Table } from "./Table"
import { Dropdown } from "./Dropdown"
import { Heading } from "./Heading"
import { Icon } from "./Icon"
import { Placeholder } from "./Placeholder"
import { WithIcon } from "./WithIcon"
import { WithLoading } from "./WithLoading"

const rowActionButtonDefaultProps = {
	size: "inherit",
	intent: "text",
	className: cn(
		"text-neutral-base hover:not-disabled:text-neutral-highlight focus-visible:text-neutral-highlight data-open:text-neutral-highlight",
		"focus-visible:outline-neutral/30",
		"hover:not-data-disabled:bg-primary-1 in-[.bg-primary-2]:hover:not-data-disabled:bg-primary-2 data-open:bg-primary-1",
		"[tr:has([data-error])_&]:not-hover:text-neutral-highlight/70 [tr:has([data-error]):hover_&]:not-hover:text-neutral-highlight/70 [tr:has([data-error]):has(:focus-visible)_&]:not-hover:text-neutral-highlight/70 [tr:has([data-error]):has(.Button[data-active=true])_&]:not-hover:text-neutral-highlight/70",
		"[tr:has([data-warning]):hover_&]:not-hover:text-neutral-highlight/70 [tr:has([data-warning]):has(:focus-visible)_&]:not-hover:text-neutral-highlight/70 [tr:has([data-warning]):has(.Button[data-active=true])_&]:not-hover:text-neutral-highlight/70",
		"[tr:has([data-info]):hover_&]:not-hover:text-neutral-highlight/70 [tr:has([data-info]):has(:focus-visible)_&]:not-hover:text-neutral-highlight/70 [tr:has([data-info]):has(.Button[data-active=true])_&]:not-hover:text-neutral-highlight/70",
		"md:-my-2.5",
	),
} satisfies ButtonProps

export const RowActions = <D extends RowData>({ actions, row, isNarrow }: RowActionsProps<D>) => {
	if (!actions) {
		return null
	}

	const [primaryActions, secondaryActions] = actions(row)
	const rowActionTestId = (() => {
		const rowEntity = row.original as { id?: number | string }
		const rowEntityId = rowEntity?.id
		return `rowAction-${rowEntityId ?? row.id}`
	})()

	if (primaryActions.length === 0 && secondaryActions.length === 0) {
		return renderFallbackValue
	}

	return (
		<div
			className={cn(
				"flex flex-col @3xl:flex-row justify-center items-center gap-0.5",
				"text-base md:text-sm",
			)}
		>
			{primaryActions.map(({ icon = "edit", ...action }, index) => (
				isExternalLinkButton(action)
					? (
						<ExternalLinkButton
							key={index}
							{...action}
							{...rowActionButtonDefaultProps}
							className={cn(rowActionButtonDefaultProps.className, action.className)}
							withoutIcon
							isNarrow={isNarrow}
						>
							<WithIcon before={icon} />
						</ExternalLinkButton>
					)
					: isLinkButton(action)
						? (
							<LinkButton
								key={index}
								{...action}
								{...rowActionButtonDefaultProps}
								className={cn(rowActionButtonDefaultProps.className, action.className)}
								isNarrow={isNarrow}
							>
								<WithIcon before={icon} />
							</LinkButton>
						)
						: (
							<Button
								key={index}
								{...action}
								{...rowActionButtonDefaultProps}
								className={cn(rowActionButtonDefaultProps.className, action.className)}
								isNarrow={isNarrow}
							>
								<WithIcon before={icon} />
							</Button>
						)
			))}
			{secondaryActions.length > 0 && (
				<Dropdown
					aria-label="Plus d'actions"
					anchor="bottom end"
					items={secondaryActions}
					data-test={rowActionTestId}
					{...rowActionButtonDefaultProps}
					isNarrow={isNarrow}
				/>
			)}
		</div>
	)
}

type NoDataRowProps = {
	isLoading?: boolean
	entityLabel?: EntityLabel
}

export const DefaultNoDataRow = ({ isLoading, entityLabel }: NoDataRowProps) => {
	return (
		<div className="flex flex-col items-center py-3 gap-4">
			{!isLoading && (
				<Icon name="error" className="size-12 text-error" />
			)}
			<WithLoading isLoading={isLoading}>
				<Heading like="h6">{entityLabel ? getEntityNoDataLabel(entityLabel) : defaultNoDataLabel}</Heading>
			</WithLoading>
		</div>
	)
}

const columnClassNameBase = cva(
	"",
	{
		variants: {
			intent: {
				default: [
					"group-hover:bg-primary-3 [tr:has(:focus-visible)_&]:bg-primary-3 [tr:has(.Button[data-active=true])_&]:bg-primary-3",
					"[tr:has([data-error])_&]:bg-error-support [tr:has([data-error]):hover_&]:bg-error-support-highlight [tr:has([data-error]):has(:focus-visible)_&]:bg-error-support-highlight [tr:has([data-error]):has(.Button[data-active=true])_&]:bg-error-support-highlight",
					"[tr:has([data-warning]):hover_&]:bg-warning-support [tr:has([data-warning]):has(:focus-visible)_&]:bg-warning-support [tr:has([data-warning]):has(.Button[data-active=true])_&]:bg-warning-support",
					"[tr:has([data-info]):hover_&]:bg-info-support [tr:has([data-info]):has(:focus-visible)_&]:bg-info-support [tr:has([data-info]):has(.Button[data-active=true])_&]:bg-info-support",
				],
			},
		},
		defaultVariants: {
			intent: "default",
		},
	}
)

const responsiveColumnClassNameBase = cva(
	"@3xl:text-current",
	{
		variants: {
			intent: {
				default: [
					"text-neutral",
					"[tr:has([data-error])_&]:text-neutral-highlight/80 [tr:has([data-error]):has(:focus-visible)_&]:text-neutral-highlight/80 [tr:has([data-error]):has(.Button[data-active=true])_&]:text-neutral-highlight/80",
					"[tr:has([data-warning]):hover_&]:text-neutral-highlight/80 [tr:has([data-warning]):has(:focus-visible)_&]:text-neutral-highlight/80 [tr:has([data-warning]):has(.Button[data-active=true])_&]:text-neutral-highlight/80",
					"[tr:has([data-info]):hover_&]:text-neutral-highlight/80 [tr:has([data-info]):has(:focus-visible)_&]:text-neutral-highlight/80 [tr:has([data-info]):has(.Button[data-active=true])_&]:text-neutral-highlight/80",
				],
			},
		},
		defaultVariants: {
			intent: "default",
		},
	}
)

type DatagridCommonProps<TData extends RowData> = {
	isLoading?: boolean
	rowActions?: RowActionsMethod<NoInfer<TData>>
	hasNarrowRowActions?: boolean
	entityLabel?: EntityLabel
	noDataRow?: typeof DefaultNoDataRow
}

export interface DatagridProps<TData extends RowData> extends TTable<TData>, DatagridCommonProps<TData>, PropsWithClassName { }

export const Datagrid = <TData extends RowData>({ isLoading, rowActions, hasNarrowRowActions, entityLabel, noDataRow: NoDataRow = DefaultNoDataRow, className, ...table }: DatagridProps<TData>) => {
	const tableRef = useCellEvents(isLoading)

	return (
		<div className="@container">
			<Table
				ref={tableRef}
				className={cn("w-full", className)}
				data-state={isLoading ? "loading" : table.getRowModel().rows.length === 0 ? "no-data" : "idle"}
				isNarrow
			>
				<THead className="hidden @3xl:table-header-group">
					{table.getHeaderGroups().map(headerGroup => (
						<Row key={headerGroup.id}>
							<Head className="@3xl:hidden" />
							{headerGroup.headers.map(header => (
								<Head
									key={header.id}
									className={getColumnClassName(header.column, cn("hidden @3xl:table-cell"))}
								>
									{header.column.getCanSort()
										? (
											<button
												className={cn(
													"text-left text-[calc(var(--em-spacing)*4)] hover:text-neutral-highlight transition-colors",
													"rounded outline-2 outline-offset-2 outline-transparent",
													"focus-visible:outline-neutral/30",
													"leading-tight",
													"w-[calc(100%+1em)] px-1 -mx-1",
													"cursor-pointer",
													{
														"text-neutral": header.column.getIsSorted(),
													}
												)}
												onClick={header.column.getToggleSortingHandler()}
												title="Modifier l'ordre d'affichage"
											>
												<WithIcon
													isNarrow
													before={
														({
															asc: "chevron-bottom",
															desc: "chevron-top",
														}[header.column.getIsSorted() as string] || "chevron-vertical") as Icons
													}
													className="block w-0 grow truncate"
													containerClassName="w-full"
												>
													{flexRender(header.column.columnDef.header, header.getContext())}
												</WithIcon>
											</button>
										)
										: (
											<div className="flex">
												<div className="w-0 grow truncate">
													{flexRender(header.column.columnDef.header, header.getContext())}
												</div>
											</div>
										)
									}
								</Head>
							))}
							{rowActions && (
								<Head className="text-center w-0">Actions</Head>
							)}
						</Row>
					))}
				</THead>
				<TBody className="relative z-1">
					{isLoading
						? (
							[...new Array(getDefaultRowCount(table))].map((_, rowIndex) => (
								<Row key={rowIndex}>
									{/** Responsive data */}
									<Cell
										className={cn(
											"@3xl:hidden",
											columnClassNameBase(),
										)}
									>
										<div className="flex flex-col gap-0.5">
											{table.getAllColumns().map((column, index) => column.getIsVisible() && (
												<div key={column.id} className={getColumnResponsiveClassName(column)}>
													<Placeholder rowIndex={rowIndex} index={index} />
												</div>
											))}
										</div>
									</Cell>
									{/** Default cols */}
									{table.getAllColumns().map((column, index) => column.getIsVisible() && (
										<Cell
											key={column.id}
											className={getColumnClassName(column, cn(
												"hidden @3xl:table-cell",
												columnClassNameBase(),
											))}
										>
											<Placeholder rowIndex={rowIndex} index={index} />
										</Cell>
									))}
									{rowActions && (
										<Cell
											className={cn(
												"RowActions w-0 text-center max-md:last:pr-2.5",
												columnClassNameBase(),
											)}
										/>
									)}
								</Row>
							))
						)
						: table.getRowModel().rows.length === 0
							? (
								<Row key="no-data">
									<Cell colSpan={table.getAllColumns().length + (rowActions ? 2 : 1)}>
										<NoDataRow isLoading={isLoading} entityLabel={entityLabel} />
									</Cell>
								</Row>
							)
							: table.getRowModel().rows.map(row => (
								<Row key={row.id}>
									{/** Responsive data */}
									<Cell
										className={cn(
											"@3xl:hidden",
											columnClassNameBase(),
										)}
									>
										<div className="flex flex-col gap-0.5">
											{row.getVisibleCells().map(cell => (
												<div key={cell.id} className={getColumnResponsiveClassName(cell.column, responsiveColumnClassNameBase())}>
													{flexRender(cell.column.columnDef.cell, cell.getContext())}
												</div>
											))}
										</div>
									</Cell>
									{/** Default cols */}
									{row.getVisibleCells().map(cell => (
										<Cell
											key={cell.id}
											className={getColumnClassName(cell.column, cn(
												"hidden @3xl:table-cell",
												columnClassNameBase(),
											))}
										>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</Cell>
									))}
									{rowActions && (
										<Cell
											className={cn(
												"RowActions w-0 text-center max-md:last:pr-2.5",
												columnClassNameBase(),
											)}
										>
											<RowActions actions={rowActions} row={row} isNarrow={hasNarrowRowActions} />
										</Cell>
									)}
								</Row>
							))
					}
				</TBody>
			</Table>
		</div>
	)
}

export type TableChildrenProps<TData extends RowData> = TTable<TData> & DatagridCommonProps<TData>

export interface WithDatagridProps<TData extends RowData> extends DatagridCommonProps<TData>, Pick<TableOptions<TData>, "data" | "columns">, Pick<PaginationOptions, "onPaginationChange" | "rowCount"> {
	pagination?: PaginationState
	sorting?: SortingState
	onSortingChange?: OnChangeFn<SortingState>
	children: (table: TableChildrenProps<TData>) => ReactNode
}

export const WithDatagrid = <TData extends RowData>({
	pagination,
	sorting,
	children,
	isLoading,
	rowActions,
	entityLabel,
	noDataRow,
	...props
}: WithDatagridProps<TData>) => {
	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		...props,
		state: { pagination, sorting },
		manualFiltering: true,
		manualSorting: true,
		manualPagination: true,
		enableSorting: !!sorting,
		renderFallbackValue,
		getCoreRowModel: getCoreRowModel(),
	})

	return children({ ...table, isLoading, rowActions, entityLabel, noDataRow })
}
