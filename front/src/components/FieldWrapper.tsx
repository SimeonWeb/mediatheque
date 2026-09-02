import type { PropsWithChildren, PropsWithClassName } from "react"

import { cn } from "@/utils/cn"

import { FieldControl, type FieldControlVariants } from "./FieldControl"
import { Badge } from "./Badge"
import { FieldError } from "./FieldError"
import { Label } from "./Label"

export interface FieldWrapperProps extends FieldControlVariants, PropsWithChildren<PropsWithClassName> {
	htmlFor?: string
	label?: React.ReactNode
	asFieldset?: boolean
	isOptional?: boolean
	isReadOnly?: boolean
	isDisabled?: boolean
	description?: React.ReactNode
	error?: React.ReactNode
	controlClassName?: string
}

export const FieldWrapper = ({
	htmlFor,
	label,
	asFieldset,
	isOptional,
	isReadOnly,
	isDisabled,
	description,
	error,
	size,
	intent,
	rounded,
	children,
	className,
	controlClassName,
}: FieldWrapperProps) => {
	const Tag = asFieldset ? "fieldset" : "div"
	const LabelTag = asFieldset ? "legend" : "div"

	return (
		<Tag
			className={cn(
				"FieldWrapper flex flex-col gap-2",
				{
					"[&_label]:cursor-default": isReadOnly || isDisabled,
				},
				className
			)}
		>
			{(!!label || !!description || isOptional || isReadOnly) && (
				<LabelTag
					className={cn(
						"flex items-center justify-between gap-8",
						{ "mb-4 w-full": asFieldset },
					)}
				>
					{label
						? asFieldset
							? <span className="font-display text-light font-bold text-lg/tight">{label}</span>
							: <Label htmlFor={htmlFor}>{label}</Label>
						: <span/>
					}
					{(!!description || isOptional || isReadOnly) && (
						<div className="flex items-center gap-4 text-right text-xs text-light/70">
							{description}
							{isOptional && (
								<Badge intent="secondary" size="inherit">
									Optionnel
								</Badge>
							)}
							{isReadOnly && (
								<Badge intent="secondary" size="inherit">
									Lecture seule
								</Badge>
							)}
						</div>
					)}
				</LabelTag>
			)}
			<div>
				<FieldControl size={size} intent={intent} rounded={rounded} className={controlClassName}>
					{children}
				</FieldControl>
				<FieldError>{error}</FieldError>
			</div>
		</Tag>
	)
}
