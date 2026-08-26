import { useAuth } from "@/stores/auth"

import { defaultItemsPerPage, defaultPage } from "./pagination"
import type { ApiList } from "./types/api"
import type { Method } from "./types/fetch"
import { defaultErrorMessage } from "./default"

export const fetchWithContext = async (
	input: `/${string}`,
	init?: RequestInit,
) => {
	const { token } = useAuth.getState()

	const response = await fetch(
		`${import.meta.env.VITE_API_URL}${input}`,
		{
			...init,
			headers: {
				Accept: "application/ld+json",
				"Authorization": token ? `Bearer ${token}` : "",
				...init?.headers,
			},
		},
	)

	if (!response.ok) {
		if (response.headers.get("content-type") !== "application/ld+json") {
			throw new Error(response.statusText || defaultErrorMessage)
		}

		const json = await response.json()

		if (Array.isArray(json)) {
			throw new Error(json[0].detail || json[0].title || json[0].message || defaultErrorMessage)
		}

		throw new Error(json.detail || json.title || json.message || defaultErrorMessage)
	}

	return response
}

export const fetchToJson = async <D>(
	input: `/${string}`,
	init?: RequestInit,
): Promise<D> => {
	const response = await fetchWithContext(input, init)

	return response.json()
}

export const fetchToJsonWithPagination = async <D>(
	input: `/${string}`,
	init?: RequestInit,
): Promise<ApiList<D>> => {
	const response = await fetchWithContext(input, init)
	const data = await response.json()

	if (data["@type"] !== "Collection") {
		throw new Error("No collection")
	}

	const { "@id": current } = data.view
	const { searchParams } = new URL(window.location.origin + current)

	const page = Number(searchParams.get("page")) || defaultPage
	const itemsPerPage = Number(searchParams.get("itemsPerPage")) || defaultItemsPerPage

	const lastPage = Math.ceil(data.totalItems / itemsPerPage)
	const nextPage = page < lastPage ? page + 1 : null
	const previousPage = page > 1 ? page - 1 : null

	return {
		pagination: {
			total: data.totalItems,
			page,
			itemsPerPage,
			lastPage,
			nextPage,
			previousPage,
		},
		items: data.member,
	}
}

export const fetchOptions = <D extends Record<string, unknown> | undefined = undefined>(method: Method, data?: D, init?: RequestInit) => ({
	method,
	...(method !== "DELETE"
		? {
			body: data ? JSON.stringify(data) : undefined,
			headers: {
				"Content-type": "application/json",
			},
		}
		: {}
	),
	...init,
})

export const toSearchParams = (params: Record<string, string | number | boolean | (string | number | boolean)[] | undefined>) => (
	Object.entries(params).flatMap(([key, value]) => (
		typeof value === "undefined"
			? []
			:	Array.isArray(value)
				? value.map(v => [`${key}[]`, typeof v === "boolean" ? v ? "1" : "0" : String(v)])
				: [[key, typeof value === "boolean" ? value ? "1" : "0" : String(value)]]
	))
)

export const withSearchParams = (url: `/${string}`, params: string[][] | Record<string, string> | string | URLSearchParams): `/${string}` => {
	const searchParams = new URLSearchParams(params).toString()

	return `${url}${searchParams ? `?${searchParams}` : ""}`
}

type FormDataRaw = string | number | boolean | null | Blob

const parseValue = (value: FormDataRaw) => {
	if (value === null) {
		return ""
	}

	switch (typeof value) {
		case "number":
		case "boolean":
			return value.toString()
		default:
			return value
	}
}

export const toFormData = (data: Record<string, FormDataRaw | FormDataRaw[]>) => {
	const formData = new FormData()

	for (const field in data) {
		const value = data[field]

		if (Array.isArray(value)) {
			for (const arrayValue of value) {
				formData.append(field, parseValue(arrayValue))
			}
		} else {
			formData.append(field, parseValue(value))
		}
	}

	return formData
}
