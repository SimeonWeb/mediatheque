/* eslint-disable */
//@ts-nocheck

/**
 * fork from `transitions-all-settled` package
 */

export class SetStack {
	constructor() {
		this.map = new Map()
	}

	has(key, item) {
		if (this.map.has(key)) {
			return this.map.get(key).has(item)
		}
		return false
	}

	push(key, item) {
		if (this.map.has(key)) {
			this.map.get(key).add(item)
		} else {
			this.map.set(key, new Set([item]))
		}
	}

	pop(key, item) {
		const set = this.map.get(key)
		if (!set) return
		set.delete(item)
		if (set.size === 0) this.map.delete(key)
	}

	get empty() {
		return this.map.size === 0
	}
}

export function transitionsAllSettled(node, callback, timeout = 100) {
	let allEnded = true
	let hasStarted = false
	let timeoutId = null
	const transitions = new SetStack()

	function checkDone() {
		if (transitions.empty) {
			off()
			callback()
		}
	}

	function onRun(e) {
		hasStarted = true
		transitions.push(e.target, e.propertyName)
	}

	function onEnd(e) {
		if (transitions.has(e.target, e.propertyName)) {
			transitions.pop(e.target, e.propertyName)
			checkDone()
		}
	}

	function onCancel(e) {
		if (transitions.has(e.target, e.propertyName)) {
			allEnded = false
			transitions.pop(e.target, e.propertyName)
			checkDone()
		}
	}

	function off() {
		node.removeEventListener("transitionrun", onRun)
		node.removeEventListener("transitionend", onEnd)
		node.removeEventListener("transitioncancel", onCancel)
		clearTimeout(timeoutId)
	}

	node.addEventListener("transitionrun", onRun)
	node.addEventListener("transitionend", onEnd)
	node.addEventListener("transitioncancel", onCancel)

	// Trigger callback if animation not started
	timeoutId = setTimeout(() => {
		if (!hasStarted) {
			off()
			callback()
			console.error(
				"The 'transitionrun' event was not fired after "
					+ timeout
					+ "ms."
			)
		}
	}, timeout)
}
