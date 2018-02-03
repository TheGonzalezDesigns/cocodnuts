import axios from 'axios'

let client = axios.create({
	//baseUrl: 'cocodnuts.com'
	proxy: {
		host: '127.0.0.1',
		port: 8080
	}
})

const validate = (res) => {
	return (res) && (res.status >= 200) && (res.status < 300)
}

exports.requestMenu = async () => {
	let res
	let valid
	const req = {
		route: 'find',
		type: 'item',
		data: {
			meta: {
				query: {
					key: 'name'
				}
			}
		},
		metaOnly: true
	}
	res = await client.post('/', req)
	valid = validate(res)
	return {
		valid: valid,
		data: valid ? res.data : []
	}
}

exports.updateMenu = async original => {
	let res
	let valid
	let req = {
		route: 'update',
		type: 'item',
	}
	let data = []
	original.forEach((one) => {
		let item = {}
		item['data'] = one
		item.meta = {}
		item['_id'] = item.did
		data.push(item)
	})
	req['data'] = data
	res = await client.post('/', req)
	valid = validate(res)
	return {
		valid: valid,
		data: valid ? res.data : []
	}
}

exports.requestDate = async () => {
	let res
	const date = new Date()
	const today = date.toJSON().slice(0, 10)
	const _default = '2111-11-11'
	const req = (date) => {
		return {
			route: 'find',
			type: 'schedule',
			data: {
				meta: {
					query: {
						date: date
					}
				}
			},
			metaOnly: true
		}
	}
	console.log('Requesting Date...')
	res = await client.post('/', req(today))
	if (res.length) return res
	res = await client.post('/', req(_default))
	return res.data[0]
}

exports.validate = validate
