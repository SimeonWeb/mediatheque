import fs from "fs"

const directory = process.argv[2];

(() => {
	if (!directory) {
		console.log("No directory defined.")

		return
	}

	const output = (asType = true) => {

		const outputValues = []

		fs.readdirSync(directory).forEach(file => {
			outputValues.push(`"${file.replace(".svg", "")}"`)
		})

		if (asType) {
			return `${[
				`/**
 * Icon types
 * this file was dynamically generated with bin/icon-types.js
 */`,
				`export type Icons = (\n\t| ${outputValues.join("\n\t| ")}\n)`,
			].join("\n\n")}\n`
		}

		return `${[
			`/**
 * Icon names
 * this file was dynamically generated with bin/icon-types.js
 */`,
			"import type { Icons } from \"./types/icons.ts\"",
			`export const icons: Icons[] = [\n\t${outputValues.join(",\n\t")},\n]`,
		].join("\n\n")}\n`
	}

	fs.writeFile("src/utils/icons.ts", output(false), err => {
		if (err) {
			throw err
		}
	})

	fs.writeFile("src/utils/types/icons.ts", output(), err => {
		if (err) {
			throw err
		}
		console.log(`Icon types updated successfully from ${directory}.\n\n`)
	})
})()
