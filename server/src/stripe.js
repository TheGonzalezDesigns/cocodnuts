exports.charge = (amount = 1000, currency = 'usd', source) => {
	const {
		secret_key
	} = require('./dynamix')
	const stripe = require("stripe")(secret_key);
	console.log('Source', source)
	stripe.charges.create({
		amount: amount,
		currency: currency,
		source: source,
	}, function (err, charge) {
		// asynchronously called
		console.error('Error:', Error)
		console.warn('Charge:', charge)
	});
}
