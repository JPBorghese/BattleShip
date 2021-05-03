module.exports = {
    searchForOpponent,
	initGame
}

// user searching for game
let searching = [];

function searchForOpponent(username) {
	if (searching.length === 0) {
		searching.push(username);
		return null;
	}

	// make sure you are not already searching for opponent
	for (let i = 0; i < searching.length; i++) {
		if (searching[i] === username) {
			return null;
		}
	}

	return searching.pop();
}

let games = [];


// returns null if other player has not sent info yet
// returns username of player to go first
function initGame(msg) {
	console.log(msg);
	let game = findGame(msg.username);

	if (game === null) {
		console.log('Game created ', msg.username, ' vs. ', msg.opponent);
		const newGame = {
			p1: msg.username,
			p2: msg.opponent,
			p1boats: msg.message,
			p2boats: null
		}

		games.push(newGame);
		return null;
	} else {
		if (game.p1 === msg.username) {
			p1boats = msg.message;
		} else {
			p2boats = msg.message;
		}

		return game.p1;
	}
}

function findGame(username) {
	for (let i = 0; i < games.length; i++) {
		let game = games[i];

		if (game.p1 === username || game.p2 === username) {
			return games[i];
		}
	}


	return null;
}

function printGames() {
	for (let i = 0; i < games.length; i++) {
		console.log(games[i]);
	}
}