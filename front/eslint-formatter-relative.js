import path from "node:path"

import { ESLint } from "eslint"

const stylish = await new ESLint().loadFormatter("stylish")

export default function relativeFormatter(results, context) {
	const cwd = context?.cwd ?? process.cwd()
	const relativeResults = results.map(result => ({
		...result,
		filePath: path.relative(cwd, result.filePath),
	}))

	return stylish.format(relativeResults, context)
}
