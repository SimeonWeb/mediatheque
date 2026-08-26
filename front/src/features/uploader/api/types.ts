export type Uploader = {
	id: string
	name: string
	slug: string
}

export type UploaderItem = Uploader & {
	total: number
}
