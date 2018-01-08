const path = require('path')
const sync = require('./api/sync')
const fileName = path.join(__dirname, '/data/data.json')
const file = require(fileName)

function get() {
	console.log('Retrieving file...')
	return sync.getData(file)
}

function publish(data) {
	console.log('Publishing file...')
	sync.setData(fileName, data, err => {
		const msg = err ? 'Publish failed.' : 'Publish succeeded'
		console.log(msg)
	})
}

exports.get = get
exports.publish = publish
