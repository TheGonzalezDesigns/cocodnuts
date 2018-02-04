const dynamix = require('./dynamix')
const stripe = require("stripe")(dynamix.secret_key);
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
const {
	cartel
} = require('./cartel')

const source = path.resolve(__dirname, '../../client/public/')
const index = path.join(source, '/index.html')
const server = express()
const port = dynamix.port

server.use(morgan('combined'))
server.use(express.json({
	strct: true
}))
server.use(cors())
server.use(express.static(source))
server.set('trust proxy', true)
server.set('trust proxy', 'loopback')

server.get('/', (req, res) => {
	res.sendFile(index)
})

server.post('/', async (req, res) => {
	console.log('Recieved POST\n', req.body)
	const data = await cartel(req.body)
	res.send(data)
})
server.post('/charge', async (req, res) => {
	console.log('Recived POST (/Charge)\n', req.body)
	const {token, order, email} = await req.body
	await stripe.charges.create({
		amount: (order.total * 100),
		currency: 'usd',
		source: token,
		receipt_email: email,
		description: "Your order"
	}, function (err, charge) {
		// asynchronously called
		if (err) {
			console.error('Error:', err.message)
			console.warn('Charge:', charge)
			console.log('source:', token)
			console.log('amount:', order.total)
			console.log('email:', email)
			res.send(false)
		}else {
 			console.warn('Charge:', charge)
			if (charge.paid) res.send(true)
			else res.send(false)
		}
	});
})

server.listen(port, console.warn(`Listening on ${port}`))
