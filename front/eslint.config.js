import { defineConfig, globalIgnores } from "eslint/config"
import globals from "globals"
import js from "@eslint/js"
import pluginQuery from "@tanstack/eslint-plugin-query"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"

import ck from "./eslint.config.ck.js"

export default defineConfig([
	...pluginQuery.configs["flat/recommended"],
	...ck.configs.base,
	...ck.configs.react,
	...ck.configs.stylistic,
	globalIgnores(["dist"]),
	{
		files: ["**/*.{ts,tsx}"],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,
		],
		languageOptions: {
			globals: globals.browser,
		},
	},
])
