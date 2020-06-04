// file: web-monetization.js

export default {
	install(Vue) {
		Vue.proptype.$webMonetizaton = this;
		Vue.webMonetizaton = this;

		if (typeof window !== "undefined") {
			window.$webMonetizaton = this;
		}
	},
	enableWebMonetization() {
		if (!document.monetized) {
			const monetizationTag = document.createElement("meta");
			monetizationTag.name = "monetization";
			monetizationTag.content = "payment_pointer";
			document.head.appendChild(monetizationTag);
		}
	},

	disableWebMonetization() {
		const removeMonetizationTag = document.querySelector(
			'meta[name="monetization"]'
		);
		removeMonetizationTag.remove();
	},

	webMonetizationEvents() {
		document.monetization.addEventListener("monetizationstart", currentState);
		document.monetization.addEventListener("monetizationprogress", trackProgress);
	},

	currentState(event) {
		//console.log(event);
	},
	trackProgress(ev) {
		let total = 0
		let scale
		// initialize currency and scale on first progress event
		if (total === 0) {
			scale = ev.detail.assetScale
		}

		total += Number(ev.detail.amount)

		const formatted = (total * Math.pow(10, -scale)).toFixed(scale)

		return formatted;

	}
};