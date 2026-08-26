import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"

import path from "path"

// https://vite.dev/config/
export default defineConfig({
	server: {
		host: "0.0.0.0",
		allowedHosts: ["localhost", "macbook-pro-de-simon.local"],
	},
	plugins: [
		// Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			quoteStyle: "double",
		}),
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./src"),
		},
	},
})
