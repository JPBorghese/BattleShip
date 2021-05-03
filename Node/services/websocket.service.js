var app = require('../app.js');
const gameService = require('../services/game.service');

module.exports = {
    onMessage,
    onError,
    onConnect
}

var clients = [];

// define types enum
const MESSAGE_TYPE = {
	Misc:0,
	Chat:1,
	Move:2,
	OpponentFound:3
}
Object.freeze(MESSAGE_TYPE);

function onConnect(ws) {
	console.log(ws._protocol, " connected");

	clients.push(ws);

	// search for opponent
	let opponent = gameService.searchForOpponent(ws._protocol);

	// if you found someone to play againt
	if (opponent) {
		console.log('Game starting: ', ws._protocol, ' vs. ', opponent);
		sendMsg(ws, opponent, MESSAGE_TYPE.OpponentFound);
		sendMsg(findSocket(opponent), ws._protocol, MESSAGE_TYPE.OpponentFound);
	} else {
		sendMsg(ws, 'Searching for opponent', MESSAGE_TYPE.Misc);
	}
}

function sendMsg(ws, message, type = MESSAGE_TYPE.Misc) {
	if (ws)
		ws.send( JSON.stringify({ message, type }));
}

function onMessage(message) {
	console.log(`Message recieved: ${message}`);

	const msg = JSON.parse(message);

	switch (msg.type) {
		case MESSAGE_TYPE.Chat: {
			sendMsg(findSocket(msg.opponent), msg.message, MESSAGE_TYPE.Chat);
			break;
		}

		default:
		break;
	}
    
}

function onError(err) {
    console.log(`error: ${err}`);
}

function findSocket(username) {
	for (let i = 0; i < clients.length; i++) {
		if (clients[i]._protocol === username) {
			return clients[i];
		}
	}

	return null;
}