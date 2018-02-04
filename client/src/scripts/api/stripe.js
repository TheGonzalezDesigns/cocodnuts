/*global Stripe*/
import {key, style} from './stripeConfig'

exports.start = () => {
	const stripe = Stripe(key)
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

	const stripeTokenHandler = (token) => {
		const form = document.getElementById('payment-form')
		const hiddenInput = document.createElement('input')
		hiddenInput.setAttribute('type', 'hidden')
		hiddenInput.setAttribute('name', 'stripeToken')
		hiddenInput.setAttribute('value', token.id)
		form.appendChild(hiddenInput)
		//form.submit()
		console.log('token', token)
	}
	const form = document.getElementById('payment-form')
	form.addEventListener('submit', async (event) => {
		event.preventDefault()

		const {token, error} = await stripe.createToken(card)

		if (error) {
			const errorElement = document.getElementById('card-errors')
			errorElement.textContent = error.message
		} else {
			stripeTokenHandler(token)
		}
	})
}
