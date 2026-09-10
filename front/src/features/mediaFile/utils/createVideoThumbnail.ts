const configuredThumbnailSize = Number.parseInt(import.meta.env.VITE_THUMB_SIZE ?? "", 10)
const THUMBNAIL_SIZE = Number.isSafeInteger(configuredThumbnailSize) && configuredThumbnailSize > 0
	? configuredThumbnailSize
	: 300
const THUMBNAIL_TIME = 0.1
const VIDEO_LOAD_TIMEOUT = 10_000

const waitForVideoEvent = (video: HTMLVideoElement, eventName: "loadeddata" | "seeked") => (
	new Promise<void>((resolve, reject) => {
		const timeout = window.setTimeout(() => {
			cleanup()
			reject(new Error("La vidéo n’a pas pu être chargée à temps."))
		}, VIDEO_LOAD_TIMEOUT)

		const cleanup = () => {
			window.clearTimeout(timeout)
			video.removeEventListener(eventName, handleSuccess)
			video.removeEventListener("error", handleError)
		}

		const handleSuccess = () => {
			cleanup()
			resolve()
		}

		const handleError = () => {
			cleanup()
			reject(new Error("Le navigateur ne peut pas lire cette vidéo."))
		}

		video.addEventListener(eventName, handleSuccess, { once: true })
		video.addEventListener("error", handleError, { once: true })
	})
)

const canvasToJpeg = (canvas: HTMLCanvasElement) => (
	new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", 0.85))
)

export const createVideoThumbnail = async (file: File): Promise<File | null> => {
	if (!file.type.startsWith("video/")) {
		return null
	}

	const video = document.createElement("video")
	const objectUrl = URL.createObjectURL(file)

	video.muted = true
	video.playsInline = true
	video.preload = "auto"

	try {
		const loaded = waitForVideoEvent(video, "loadeddata")
		video.src = objectUrl
		video.load()
		await loaded

		if (Number.isFinite(video.duration) && video.duration > 0) {
			const targetTime = Math.min(THUMBNAIL_TIME, video.duration / 2)
			if (targetTime > 0) {
				const seeked = waitForVideoEvent(video, "seeked")
				video.currentTime = targetTime
				await seeked
			}
		}

		if (video.videoWidth < 1 || video.videoHeight < 1) {
			return null
		}

		const ratio = Math.min(THUMBNAIL_SIZE / Math.max(video.videoWidth, video.videoHeight), 1)
		const canvas = document.createElement("canvas")
		canvas.width = Math.max(1, Math.round(video.videoWidth * ratio))
		canvas.height = Math.max(1, Math.round(video.videoHeight * ratio))

		const context = canvas.getContext("2d")
		if (!context) {
			return null
		}

		context.drawImage(video, 0, 0, canvas.width, canvas.height)
		const blob = await canvasToJpeg(canvas)

		return blob ? new File([blob], "thumbnail.jpg", { type: "image/jpeg" }) : null
	} catch {
		return null
	} finally {
		video.pause()
		video.removeAttribute("src")
		video.load()
		URL.revokeObjectURL(objectUrl)
	}
}
