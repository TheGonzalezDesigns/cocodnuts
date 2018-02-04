/*global Stripe*/
import {key, style} from './stripeConfig'

const stripe = Stripe(key)
exports.start = () => {
	const elements = stripe.elements()
	const card = elements.create('card', {style})

	card.mount('#card-element')

	card.addEventListener('change', ({error, complete}) => {
		const displayError = document.getElementById('card-errors')
		const stripeButton = document.getElementById('stripeButton')
		displayError.textContent = error ? error.message : ''
		if (error || !complete) stripeButton.disabled = true
		if (complete) stripeButton.disabled = false
	})

	const form = document.getElementById('payment-form')
	form.addEventListener('submit', async (event) => {
		event.preventDefault()
	})

	return card
}
exports.stripe = stripe
