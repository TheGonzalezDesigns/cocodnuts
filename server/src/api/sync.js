const fs = require('fs')

function getData(file) {
    return JSON.stringify(file, null, 2);
}

function setData(file, data, err) {
    data = JSON.stringify(data, null, 2);
    fs.writeFile(file, data, err);
}

exports.getData = getData;
exports.setData = setData;
