/**
 * @doc https://gist.github.com/wojtekmaj/fe811af47fad12a7265b6f7df1017c83
 */
export const findScrollContainer = (element: HTMLElement) => {
	if (!element) {
		return window
	}

	let parent = element.parentElement
	while (parent) {
		const { overflow } = window.getComputedStyle(parent)
		if (overflow.split(" ").every(o => o === "auto" || o === "scroll")) {
			return parent
		}
		parent = parent.parentElement
	}

	return window
}
