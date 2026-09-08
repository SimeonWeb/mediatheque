export const isSafari = () => (
	window.navigator.userAgent.includes("Safari") && !window.navigator.userAgent.includes("Chrome")
)

export const isIos = () => (
	window.navigator.userAgent.includes("iPhone") || window.navigator.userAgent.includes("iPad")
)
