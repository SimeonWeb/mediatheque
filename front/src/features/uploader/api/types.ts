export type Uploader = {
	id: number
	name: string
	slug: string
}

export type UploaderItem = Uploader & {
	total: number
}


export type AddUploaderError = Error & {
	cause: {
		data: {
			uploaderId: number
		}
	}
}
