exports.InvervalTimer = function(callback, interval) {
	let timerId, startTime, remaining = 0
	let state = 0 //  0 = idle, 1 = running, 2 = paused, 3= resumed
	this.pause = function () {
		if (state === 1) {
			remaining = interval - (new Date() - startTime)
			window.clearInterval(timerId)
			state = 2
		}
	}
	this.resume = function () {
		if (state === 2) {
			state = 3
			window.setTimeout(this.timeoutCallback, remaining)
		}
	}
	this.timeoutCallback = function () {
		if (state === 3) {
			callback()
			startTime = new Date()
			timerId = window.setInterval(callback, interval)
			state = 1
		}
	}
	startTime = new Date()
	timerId = window.setInterval(callback, interval)
	state = 1
}
