import z from "zod"

import { formatDate } from "./date"


export const dateToIsoDatetime = z.codec(
	z.date().nullable(),
	z.literal("").or(z.iso.datetime()),
	{
		decode: date => date === null ? "" : date.toISOString(),
		encode: isoString => new Date(isoString),
	}
)

export const dateToIsoDate = z.codec(
	z.date().nullable(),
	z.literal("").or(z.iso.date()),
	{
		decode: date => date === null ? "" : formatDate(date),
		encode: string => new Date(string),
	}
)

export const numberOrNullToString = z.codec(
	z.number().nullable(),
	z.literal("").or(z.string().regex(z.regexes.number)),
	{
		decode: number => number === null ? "" : number.toString(),
		encode: string => Number.parseFloat(string),
	}
)

export const stringOrNullToString = z.codec(
	z.string().nullable(),
	z.string(),
	{
		decode: string => string === null ? "" : string,
		encode: string => string === "" ? null : string,
	}
)

export const parseTime = (timeInMinutes: number): [number, number] => {
	const hours = Math.floor(timeInMinutes / 60)
	const minutes = timeInMinutes % 60

	return [hours, minutes]
}

export const timeToMinutes = z.codec(
	z.string().nullable(),
	z.number().nullable(),
	{
		decode: time => {
			if (time === null) {
				return null
			}

			const [hours, minutes] = time.split(":").map(Number)

			if (isNaN(hours)) {
				return null
			}

			return (hours || 0) * 60 + (minutes || 0)
		},
		encode: timeInMinutes => {
			if (timeInMinutes === null) {
				return null
			}

			const [hours, minutes] = parseTime(timeInMinutes)

			return `${hours}:${minutes < 10 ? "0" : ""}${minutes}`
		},
	}
)
