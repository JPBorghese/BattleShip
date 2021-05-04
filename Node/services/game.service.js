module.exports = {
    searchForOpponent,
	initGame,
	shot
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
	console.log('init: ', msg);
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
			game.p1boats = msg.message;
		} else {
			game.p2boats = msg.message;
		}

		console.log(game);

		return game;
	}
}

function shot(username, coord) {
	let game = findGame(username);

	if (!game) {
		console.log(username, ' shot without being in a game');
		return null;
	}

	let ships = (game.p1 === username) ? game.p2boats : game.p1boats;

	const i1 = ships.Courier.indexOf(coord);
	const i2 = ships.Battleship.indexOf(coord);
	const i3 = ships.Cruiser.indexOf(coord);
	const i4 = ships.Submarine.indexOf(coord);
	const i5 = ships.Destroyer.indexOf(coord);

	let hit = (i1 == -1 || i2 == -1 || i3 == -1 || i4 == -1 || i5 == -1);
	let shipSunk = false;

	if (hit) {
		if (i1 != -1) {
			ships.Courier.splice(i1, 1);
			if (!ships.Courier.length) {
				shipSunk = true;
			}
		} else if (i2 != -1) {
			ships.Battleship.splice(i2, 1);
			if (!ships.Battleship.length) {
				shipSunk = true;
			}
		} else if (i3 != -1) {
			ships.Cruiser.splice(i3, 1);
			if (!ships.Cruiser.length) {
				shipSunk = true;
			}
		} else if (i4 != -1) {
			ships.Submarine.splice(i4, 1);
			if (!ships.Submarine.length) {
				shipSunk = true;
			}
		} else if (i5 != -1) {
			ships.Destroyer.splice(i5, 1);
			if (!ships.Destroyer.length) {
				shipSunk = true;
			}
		}
	}

	let gameover = ((ships.Courier.length + ships.Battleship.length + ships.Cruiser.length + ships.Submarine.length + ships.Destroyer.length) === 0);


	return { 
		coord: coord,
		hit: hit,
		shipSunk: shipSunk,
		gameover: gameover
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