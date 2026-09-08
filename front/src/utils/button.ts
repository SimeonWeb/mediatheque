import type { ButtonProps, ExternalLinkButtonProps, LinkButtonProps } from "@/components/Button"

export const isButton = (props: ButtonProps | LinkButtonProps | ExternalLinkButtonProps): props is ButtonProps => (
	("type" in props) && !!props.type
	|| !("href" in props) && !("to" in props)
)

export const isLinkButton = (props: ButtonProps | LinkButtonProps | ExternalLinkButtonProps): props is LinkButtonProps => (
	"to" in props
)

export const isExternalLinkButton = (props: ButtonProps | LinkButtonProps | ExternalLinkButtonProps): props is ExternalLinkButtonProps => (
	"href" in props
)
