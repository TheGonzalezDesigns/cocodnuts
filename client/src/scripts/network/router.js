/*global exports*/
import axios from 'axios'

let client = axios.create({
	baseURL: 'https://cocodnuts.com'
})

exports.getData = async () => {
	return await client.get('/getData')
}

exports.updateData = async (data) => {
	await client.post('/publish', data)
}
