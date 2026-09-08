import dayjs from "dayjs"

export const formatDate = (date?: dayjs.ConfigType, format = "YYYY-MM-DD") => (
	dayjs(date).format(format)
)

export const formatTimeFromDateTime = (date?: dayjs.ConfigType, format = "HH:mm") => (
	formatDate(date, format)
)

export const formatDateTimeIso = (date?: dayjs.ConfigType) => (
	dayjs(date).format()
)

export const displayDate = (date?: dayjs.ConfigType, format = "DD/MM/YYYY") => (
	dayjs(date).format(format)
)

export const displayDateTime = (date?: dayjs.ConfigType) => (
	dayjs(date).format("DD/MM/YYYY HH:mm")
)

export const displayDatesDiff = (first?: dayjs.ConfigType, second?: dayjs.ConfigType) => {
	if (!first || !second) {
		return 0
	}

	return Math.abs(dayjs(second).diff(dayjs(first), "day"))
}

export const isExpired = (date: dayjs.ConfigType) => (
	dayjs(date).isBefore()
)
