export type Uploader = {
	id: string
	name: string
	slug: string
}

export type UploaderItem = Uploader & {
	total: number
}


export type AddUploaderError = Error & {
	cause: {
		data: {
			uploaderId: string
		}
	}
}
