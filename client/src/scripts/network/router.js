/*global exports*/
import axios from 'axios'

let client = axios.create({
	baseURL: ''
})

function validate(res) {
	return (res) && (res.status >= 200) && (res.status < 300)
}

function requestData(ifvalid, iferror) {
	client.get('/getData').then(res => ifvalid(res)).catch(err => iferror(err))
}

function updateData(data, ifvalid, iferror) {
	client.post('/publish', data).then(res => ifvalid(res)).catch(err => iferror(err))
}

exports.validate = validate
exports.requestData = requestData
exports.updateData = updateData
