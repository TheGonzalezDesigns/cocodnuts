const dynamix = require('./dynamix')
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

server.listen(port, console.warn(`Listening on ${port}`))
