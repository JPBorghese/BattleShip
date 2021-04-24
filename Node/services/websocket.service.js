var app = require('../app.js');

module.exports = {
    onMessage,
    onError
}

function onMessage(msg) {
    console.log(`Received message: ${msg}`);
}

function onError(err) {
    console.log(`error: ${err}`);
}