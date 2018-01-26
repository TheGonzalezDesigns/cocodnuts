/*global exports */
/*global Stripe */
//import Stripe from 'stripe'
//import stripePackage from 'stripe';
import config from './stripeConfig'
import {
	handler
} from './stripeHandler'

const stripe = Stripe(config.key)
const elements = stripe.elements()

const card = elements.create('card', config.style)
card.mount('#card-element')

card.addEventListener('change', (event) => document.getElementById('card-errors').textContent = event.error ? event.error.message : '')

const form = document.getElementById('payment-form')
form.addEventListener('submit', async (event) => {
	event.preventDefault()

	const {
		token,
		error
	} = await stripe.createToken(card)

	if (error) {
		const errorElement = document.getElementById('card-errors')
		errorElement.textContent = error.message
	} else {
		// Send the token to your server
		handler(token)
	}
})
