import { useEffect } from "react"

export type TouchMoveParams = {
	x: number
	y: number
	min: number
	event: TouchEvent
}

export type KeyboardNavigationEvents = {
	onKeyTop: () => void
	onKeyRight: () => void
	onKeyBottom: () => void
	onKeyLeft: () => void
}

export type TouchNavigationEvents = {
	onSwipeTop: () => void
	onSwipeRight: () => void
	onSwipeBottom: () => void
	onSwipeLeft: () => void
	onTouchMove: (params: TouchMoveParams) => void
}

export type GeneralNavigationEvents = {
	onTop: () => void
	onRight: () => void
	onBottom: () => void
	onLeft: () => void
}

export type UseCardinalNavigationEvents = Partial<(
	& KeyboardNavigationEvents
	& TouchNavigationEvents
	& GeneralNavigationEvents
)>

export const useCardinalNavigation = ({
	onKeyTop,
	onKeyRight,
	onKeyBottom,
	onKeyLeft,
	onSwipeTop,
	onSwipeRight,
	onSwipeBottom,
	onSwipeLeft,
	onTouchMove,
	onTop,
	onRight,
	onBottom,
	onLeft,
}: UseCardinalNavigationEvents) => {
	const min = 50

	// Keyboard navigation
	useEffect(
		() => {
			const handleKeydown = ({ key }: KeyboardEvent) => {
				switch (key) {
					case "ArrowTop":
						onKeyTop?.()
						onTop?.()
						break
					case "ArrowRight":
						onKeyRight?.()
						onRight?.()
						break
					case "ArrowBottom":
						onKeyBottom?.()
						onBottom?.()
						break
					case "ArrowLeft":
						onKeyLeft?.()
						onLeft?.()
						break
				}
			}

			document.addEventListener("keydown", handleKeydown)

			return () => {
				document.removeEventListener("keydown", handleKeydown)
			}
		},
		[
			onKeyTop,
			onKeyRight,
			onKeyBottom,
			onKeyLeft,
			onTop,
			onRight,
			onBottom,
			onLeft,
		]
	)

	// Touch navigation
	useEffect(
		() => {
			let touchStartX: number
			let touchStartY: number
			let touchMoveX: number
			let touchMoveY: number
			let touchEndX: number
			let touchEndY: number

			// General events are inversed on swipe because of navigation logic
			const doSwipe = () => {
				const diffX = touchEndX - touchStartX
				const diffY = touchEndY - touchStartY

				// Horizontal
				if (Math.abs(diffX) > Math.abs(diffY)) {
					if (Math.abs(diffX) > min) {

						// Right
						if (diffX > 0) {
							onSwipeRight?.()
							onLeft?.()

							// Left
						} else {
							onSwipeLeft?.()
							onRight?.()
						}
					}
				// Vertical
				} else {
					if (Math.abs(diffY) > min) {

						// Bottom
						if (diffY > 0) {
							onSwipeBottom?.()
							onTop?.()

							// Top
						} else {
							onSwipeTop?.()
							onBottom?.()
						}
					}
				}
			}

			const handleTouchStart = (event: TouchEvent) => {
				touchStartX = event.changedTouches[0].screenX
				touchStartY = event.changedTouches[0].screenY
			}

			const handleTouchMove = (event: TouchEvent) => {
				touchMoveX = event.changedTouches[0].screenX
				touchMoveY = event.changedTouches[0].screenY

				const diffX = touchMoveX - touchStartX
				const diffY = touchMoveY - touchStartY

				onTouchMove?.({ x: diffX, y: diffY, min, event })
			}

			const handleTouchEnd = (event: TouchEvent) => {
				touchEndX = event.changedTouches[0].screenX
				touchEndY = event.changedTouches[0].screenY
				doSwipe()
			}

			document.addEventListener("touchstart", handleTouchStart)
			document.addEventListener("touchmove", handleTouchMove)
			document.addEventListener("touchend", handleTouchEnd)

			return () => {
				document.removeEventListener("touchstart", handleTouchStart)
				document.removeEventListener("touchmove", handleTouchMove)
				document.removeEventListener("touchend", handleTouchEnd)
			}
		},
		[
			onSwipeTop,
			onSwipeRight,
			onSwipeBottom,
			onSwipeLeft,
			onTouchMove,
			onTop,
			onRight,
			onBottom,
			onLeft,
		]
	)
	return null
}
