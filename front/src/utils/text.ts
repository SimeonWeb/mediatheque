export const upperFirst = (string: string) => (
	string.charAt(0).toUpperCase() + string.slice(1)
)

export const isVowelFirst = (string: string) => (
	/^[aeéèêiïou]$/.test(string[0])
)

/**
 * Each `plural`, `singular` & `none` strings must contains `{amount}`, which will be replaced by amount value
 */
export const getPluralizedText = (amount = 0, plural: string, singular: string, none?: string) => (
	(amount > 1 ? plural : amount === 0 && none ? none : singular).replace("{amount}", amount.toString())
)

export const joinText = (texts: (string | number | null | undefined)[], separator = " ") => (
	texts.filter(string => !isNaN(Number(string)) || !!string).join(separator)
)
