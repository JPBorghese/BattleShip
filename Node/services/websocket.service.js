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
	Disconnect:-1,
	Misc:0,
	Chat:1,
	Move:2,
	OpponentFound:3,
	SearchOpponent:4,
	ShipData:5
}
Object.freeze(MESSAGE_TYPE);

function onConnect(ws) {
	if (!findSocket(ws._protocol)) {
		clients.push(ws);
		console.log(ws._protocol, " connected");
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
		case MESSAGE_TYPE.Disconnect: {
			removeSocket();
			break;
		}

		case MESSAGE_TYPE.Chat: {
			//console.log('Message sent: ', msg.opponent, ' ', msg.message);
			sendMsg(findSocket(msg.opponent), msg.message, MESSAGE_TYPE.Chat);
			break;
		}

		case MESSAGE_TYPE.SearchOpponent: {
			searchForOpponent(msg.username);
			break;
		}

		case MESSAGE_TYPE.ShipData: {
			let first = gameService.initGame(msg);

			if (first) {
				sendMsg(findSocket(msg.username), first, MESSAGE_TYPE.ShipData);
				sendMsg(findSocket(msg.opponent), first, MESSAGE_TYPE.ShipData);
			}
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

function removeSocket(username) {
	let c = null;
	
	for (let i = 0; i < clients.length; i++) {
		if (clients[i]._protocol === username) {
			c = clients[i];
			clients.splice(i, 1);
			break;
		}
	}

	if (!c) {
		console.log(c._protocol, " Disconnected");
		c.close();
	}
}

function searchForOpponent(username) {
	let ws = findSocket(username);

	// search for opponent
	let opponent = gameService.searchForOpponent(username);

	// if you found someone to play againt
	if (opponent) {
		console.log('Game starting: ', ws._protocol, ' vs. ', opponent);
		sendMsg(ws, opponent, MESSAGE_TYPE.OpponentFound);
		sendMsg(findSocket(opponent), ws._protocol, MESSAGE_TYPE.OpponentFound);
	} else {
		console.log(username, ' searching for opponent');
		sendMsg(ws, 'Searching for opponent', MESSAGE_TYPE.SearchOpponent);
	}
}