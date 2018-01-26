/*global exports */
exports.handler = (token) => {
	// Insert the token ID into the form so it gets submitted to the server
	const form = document.getElementById('payment-form')
	const hiddenInput = document.createElement('input')
	hiddenInput.setAttribute('type', 'hidden')
	hiddenInput.setAttribute('name', 'stripeToken')
	hiddenInput.setAttribute('value', token.id)
	form.appendChild(hiddenInput)

	// Submit the form
	form.submit()
}
