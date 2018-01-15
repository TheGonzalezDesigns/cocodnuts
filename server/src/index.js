const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const server = express()
const path = require('path')
const dynamix = require('./dynamix')
const source = path.resolve(__dirname, '../../client/public/')
const index = path.join(source, '/index.html')

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

server.listen(port, console.warn(`Listening on ${port}`))
