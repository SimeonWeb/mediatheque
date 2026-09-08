import { Listbox as ListboxBase, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { type PropsWithClassName, type ReactNode } from "react"
import { type VariantProps, cva } from "class-variance-authority"

import { type Align, type Placement, navigationElementVariant } from "@/utils/navigation"
import { cn } from "@/utils/cn"

import { Button } from "./Button"
import { Icon } from "./Icon"
import { WithIcon } from "./WithIcon"

const listBoxWrapperVariants = cva(
	[
		"ListboxContainer",
		"relative",
		"w-full h-fit grid grid-cols-1",
		"in-[.FieldControl]:text-[1em]",
		"in-[.FieldControl]:not-first:pl-0 in-[.FieldControl]:not-last:pr-0",
	],
	{
		variants: {
			size: {
				inherit: [
					"text-[1em] leading-tight",
				],
			},
		},
		defaultVariants: {
			size: "inherit",
		},
	}
)

const listBoxButtonVariants = cva(
	[
		"ListboxButton",
		"col-start-1 row-start-1",
		"pl-[1.25em] py-[.75em] pr-[2.5em]",
		"[.ListboxContainer:has(.ListboxClearButton)_&]:pr-[5.5em] [.FieldControl>div:not(:last-child)>&]:pr-[1.5em] [.FieldControl>div:not(:last-child)>&]:[.ListboxContainer:has(.ListboxClearButton)_&]:pr-[4.5em]",
		"outline data-focus:outline-2",
		"in-[.FieldControl]:text-[1em]",
		"in-[.FieldControl]:outline-0!",
		"in-[.FieldControl]:bg-transparent in-[.FieldControl]:text-current",
		"has-[+_.FieldError]:outline-2 has-[+_.FieldError]:outline-error! has-[+_.FieldError]:relative",
		"text-left",
		"shadow-[0_1rem_2rem_var(--tw-shadow-color)] shadow-black/10",
		"cursor-pointer disabled:cursor-not-allowed",
		"transition",
	],
	{
		variants: {
			intent: {
				default: [
					"bg-white/60 backdrop-blur-xl",
					"text-neutral-900 placeholder:text-neutral-400 disabled:text-neutral-400 aria-readonly:text-neutral-900",
					"outline-transparent data-focus:outline-primary",
				],
			},
			rounded: {
				true: "rounded-3xl",
				false: "rounded-lg",
			},
		},
		defaultVariants: {
			intent: "default",
			rounded: true,
		},
	},
)

export type ListboxWrapperVariants = VariantProps<typeof listBoxWrapperVariants>
export type ListboxButtonVariants = VariantProps<typeof listBoxButtonVariants>

export type OptionValue = string | number
export type Option<TValue extends OptionValue = OptionValue> = {
	label: ReactNode
	value: TValue
	disabled?: boolean
}
export type SingleValue<I> = I | null
export type MultiValue<I> = I[]

export type ListboxSelectedHandler<
	TValue extends OptionValue,
	TMultiple extends boolean = false,
> = (option: TMultiple extends true ? MultiValue<Option<TValue>> : SingleValue<Option<TValue>>) => void

export interface ListboxProps<
	TValue extends OptionValue,
	TMultiple extends boolean = false,
> extends
	ListboxWrapperVariants,
	ListboxButtonVariants,
	PropsWithClassName {
	id?: string
	name?: string
	multiple?: TMultiple
	options: MultiValue<Option<TValue>>
	value?: NoInfer<TMultiple extends true ? MultiValue<TValue> : TValue>
	defaultValue?: NoInfer<TMultiple extends true ? MultiValue<TValue> : TValue>
	containerClassName?: string
	menuClassName?: string
	onSelected?: ListboxSelectedHandler<TValue, TMultiple>
	readOnly?: boolean
	disabled?: boolean
	isClearable?: boolean
	placeholder?: string
	autoFocus?: boolean
	anchor?: Placement | `${Placement} ${Align}`
}

type ListboxLabelsProps<TValue extends OptionValue> = {
	selectedOptions: MultiValue<Option<TValue>> | SingleValue<Option<TValue>>
	placeholder?: string
}

const ListboxLabels = <TValue extends OptionValue>({
	selectedOptions,
	placeholder,
}: ListboxLabelsProps<TValue>) => {
	const emptyLabel = <span className="text-neutral-highlight/50">{placeholder || "\xa0"}</span>

	if (selectedOptions === null) {
		return emptyLabel
	}

	if (Array.isArray(selectedOptions)) {
		if (selectedOptions.length === 0) {
			return emptyLabel
		}

		return (
			<span
				className={cn(
					"flex flex-wrap items-center gap-1",
					"whitespace-nowrap truncate",
					"pointer-events-none"
				)}
			>
				{selectedOptions.map(({ value, label }) => (
					<span
						key={value}
						className={cn(
							"inline-flex",
							"text-xs font-medium leading-none",
							"bg-primary-4 in-disabled:bg-primary-3 in-aria-readonly:bg-primary-4",
							"text-neutral-highlight in-disabled:text-neutral-highlight/50 in-aria-readonly:text-neutral-highlight",
							"py-1 px-1.5",
							"rounded",
						)}
					>
						{label}
					</span>
				))}
			</span>
		)
	}

	return <span>{selectedOptions.label}</span>
}

const getOptionFromValue = <TValue extends OptionValue>(
	options: MultiValue<Option<TValue>>,
	value?: MultiValue<TValue> | SingleValue<TValue>
) => {
	if (value === null || value === undefined) {
		return null
	}

	return Array.isArray(value)
		? options.filter(option => value.includes(option.value))
		: options.find(option => option.value === value) || null
}

export const Listbox = <
	TValue extends OptionValue,
	TMultiple extends boolean = false,
>({
	id,
	size,
	intent,
	rounded,
	options,
	containerClassName,
	menuClassName,
	name,
	value,
	defaultValue,
	onSelected,
	multiple,
	readOnly,
	disabled,
	isClearable,
	placeholder,
	autoFocus,
	className,
	anchor = "bottom start",
}: ListboxProps<TValue, TMultiple>) => {
	const selectedOptions = getOptionFromValue(options, value ?? defaultValue)

	const hasValue = multiple ? Array.isArray(selectedOptions) && selectedOptions.length > 0 : !!selectedOptions

	const clearInnerValue = () => {
		const clearedValue = multiple ? [] : null

		if (onSelected) {
			onSelected(clearedValue as Parameters<ListboxSelectedHandler<TValue, TMultiple>>[0])
		}
	}

	return (
		<div className={cn(listBoxWrapperVariants({ size }), containerClassName)}>
			<ListboxBase
				name={name}
				multiple={multiple}
				value={selectedOptions}
				onChange={value => {
					if (
						!isClearable
						&& (
							value === null
							|| Array.isArray(value) && value.length === 0
						)
					) {
						return
					}

					if (onSelected) {
						onSelected(value as Parameters<ListboxSelectedHandler<TValue, TMultiple>>[0])
					}
				}}
			>
				<ListboxButton
					id={id}
					className={cn(listBoxButtonVariants({ intent, rounded }), className)}
					aria-readonly={readOnly}
					disabled={readOnly || disabled}
					autoFocus={autoFocus}
				>
					<ListboxLabels
						selectedOptions={selectedOptions}
						placeholder={placeholder}
					/>
				</ListboxButton>
				<ListboxOptions
					transition
					anchor={{ to: anchor, gap: 4 }}
					modal={false}
					className={cn(
						"min-w-(--button-width)",
						"flex flex-col gap-1 p-1",
						"rounded-3xl outline-none",
						"bg-white/60 backdrop-blur-xl",
						"data-closed:translate-y-2 data-closed:opacity-0",
						"shadow-[0_1rem_2rem_var(--tw-shadow-color)] shadow-black/10",
						"transition",
						"z-40",
						menuClassName,
					)}
				>
					{options.map(option => (
						<ListboxOption
							key={option.value}
							value={option}
							className={navigationElementVariant()}
							disabled={option.disabled}
						>
							{({ selected }) => (
								<WithIcon
									after="check"
									containerClassName={cn({
										"[&>.Icon]:scale-0": !selected,
									})}
								>
									{option.label}
								</WithIcon>
							)}
						</ListboxOption>
					))}
				</ListboxOptions>
			</ListboxBase>
			{hasValue && isClearable && (
				<Button
					intent="text"
					size="inherit"
					isNarrow
					onClick={clearInnerValue}
					title="Effacer la sélection"
					className={cn(
						"ListboxClearButton",
						"relative col-start-1 row-start-1 self-center justify-self-end",
						"px-[.904em] py-[.65em]",
						"mr-[2.875em] [.FieldControl>div:not(:last-child)>&]:mr-[1.715em]",
						"z-1",
					)}
				>
					<WithIcon before="x" />
				</Button>
			)}
			<Icon
				name="chevron-vertical"
				size="sm"
				className="pointer-events-none col-start-1 row-start-1 mr-[1em] self-center justify-self-end z-1"
			/>
		</div>
	)
}
