/*global exports */
/*global Stripe */
import {
	Card,
	createToken
} from 'vue-stripe-elements-plus'
import {
	key,
	style
} from './stripeConfig.js'
import Vue from 'vue'
import axios from 'axios'

const client = axios.create({
	//baseUrl: 'cocodnuts.com'
	proxy: {
		host: '127.0.0.1',
		port: 8080
	}
})

Vue.component('stripe', {
	template: `
	<div id='stripe'>
		<card class='stripe-card'
			:class='{ complete }'
			stripe='${key}'
			:options='stripeOptions'
			@change='complete = $event.complete'
    	/>
		<label class="label"></label>
    	<button class='pay-with-stripe button is-success' @click='pay' :disabled='!complete'> Place Order !</button>
		<div id='card-errors' class='help'  role="alert"></div>
	</div>`,
	data() {
		return {
			complete: false,
			stripeOptions: style
		}
	},
	components: {
		Card
	},
	methods: {
		async pay() {
			// createToken returns a Promise which resolves in a result object with
			// either a token or an error key.
			// See https://stripe.com/docs/api#tokens for the token object.
			// See https://stripe.com/docs/api#errors for the error object.
			// More general https://stripe.com/docs/stripe.js#stripe-create-token.
			const token = await createToken()
			client.post('/charge', token)
		}
	}
})
