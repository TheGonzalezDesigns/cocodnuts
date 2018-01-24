/*global exports*/
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

exports.validate = validate
