export const getFileUrl = (url: string) => (
	`${import.meta.env.VITE_UPLOADS_URL}/${url}`
)
