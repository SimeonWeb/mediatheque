export const omit = <O extends Record<string, unknown>, P extends keyof O>(object: O, paths: P[]) => {
	const newObject = { ...object }

	for (const path of paths) {
		Reflect.deleteProperty(newObject, path)
	}

	return newObject as Omit<O, P>
}

export const pick = <O extends Record<string, unknown>, P extends keyof O>(object: O, paths: P[]) => {
	const newObject = {}

	for (const path of paths) {
		Reflect.defineProperty(newObject, path, { value: object[path], enumerable: true })
	}

	return newObject as Pick<O, P>
}


export const isEmpty = (object: unknown) => (
	typeof object !== "object" || object === null || Object.keys(object).length === 0
)
