const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const server = express()

const public = '../client/public/'

server.use(morgan('combined'))
server.use(bodyParser.json())
server.use(cors())
server.use(express.static(public))
server.set('trust proxy', true)
server.set('trust proxy', 'loopback')

server.get('/getData', (req, res) => {
	res.send(handle.get())
})

server.post('/publish', (req, res) => {
	res.send(handle.publish({
		"data": req.body.data
	}))
})

server.listen(8081)
