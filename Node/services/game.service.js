module.exports = {
    searchForOpponent
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



function printGames() {
	for (let i = 0; i < games.length; i++) {
		console.log(games[i]);
	}
}