const axios = require('axios')
exports.cartel = async (client) => {
	const proxy = axios.create({
		proxy: {
			host: '127.0.0.1',
			port: 8888
		}
	})
	const res = await proxy.post('/', client)
	const data = res.data
	console.log('Response @ cartel.js: ', data)
	return data
}
