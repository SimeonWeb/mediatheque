declare module "react" {
	type PropsWithClassName<P = unknown> = P & {
		className?: string | undefined;
	}
}

export type TypeFromArrayConst<TArray extends readonly string[]> = TArray[number]

export type TypeFromObjectConst<TObject extends { readonly [x: string]: number | string }> = TObject[keyof TObject]
