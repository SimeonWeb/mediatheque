import react from "eslint-plugin-react"
import stylistic from "@stylistic/eslint-plugin"
import tseslint from "typescript-eslint"

const eslintCk = {
	meta: {
		name: "eslint-ck",
		version: "0.0.1",
	},
	configs:
		{
			stylistic: [
				{
					plugins: {
						"@stylistic": stylistic,
						"@typescript-eslint": tseslint.plugin,
					},
					rules: {
						"@stylistic/array-bracket-spacing": ["warn", "never"],
						"@stylistic/array-element-newline": [
							"warn",
							{
								"ArrayExpression": "consistent",
							},
						],
						"@stylistic/arrow-parens": ["warn", "as-needed"],
						"@stylistic/comma-dangle": [
							"warn",
							{
								"arrays": "always-multiline",
								"objects": "always-multiline",
								"imports": "always-multiline",
								"exports": "always-multiline",
								"functions": "only-multiline",
								"importAttributes": "always-multiline",
								"dynamicImports": "always-multiline",
								"enums": "always-multiline",
								"generics": "always-multiline",
								"tuples": "always-multiline",
							},
						],
						"@stylistic/dot-location": ["warn", "property"],
						"@stylistic/function-call-argument-newline": ["warn", "consistent"],
						"@stylistic/function-paren-newline": ["warn", "multiline-arguments"],
						"@stylistic/indent": [
							"warn",
							"tab",
							{
								"SwitchCase": 1,
							},
						],
						// "@stylistic/no-extra-parens": [
						//   "warn",
						//   "all",
						//   {
						//     ignoreJSX: "all",
						//   }
						// ],
						"@stylistic/no-multiple-empty-lines": [
							"warn",
							{
								max: 2,
								maxEOF: 1,
								maxBOF: 0,
							},
						],
						"@stylistic/object-curly-spacing": ["warn", "always"],
						"@stylistic/operator-linebreak": [
							"warn",
							"before",
						],
						"@stylistic/quotes": ["warn", "double"],
						"@stylistic/semi": ["warn", "never"],
						"@stylistic/space-in-parens": ["warn", "never"],
						"@typescript-eslint/no-unused-vars": [
							"warn",
							{
								"ignoreRestSiblings": true,
								"destructuredArrayIgnorePattern": "^_",
							},
						],
					},
				},
			],
			react: [
				{
					plugins: {
						react,
					},
					rules: {
						"react/prop-types": "off",
						"react/no-unescaped-entities": "off",
						// This rule is explicitly not compatible with eslint 10
						"react/jsx-curly-spacing": ["warn", { "when": "never", "children": true }],
						"react/jsx-child-element-spacing": "warn",
						// "react-hooks/exhaustive-deps": "off",
					},
				},
			],
			base: [
				{
					rules: {
						"complexity": ["warn", 20],
						"func-style": "warn",
						"no-unused-vars": "off",
						"one-var": ["warn", "never"],
						"sort-imports": [
							"warn",
							{
								ignoreCase: false,
								ignoreDeclarationSort: false,
								ignoreMemberSort: false,
								memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
								allowSeparatedGroups: true,
							},
						],
					},
				},
			],
		},
}

export default eslintCk
