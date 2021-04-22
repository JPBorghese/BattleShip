const config = require('../config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/BattleShip', { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true  });

module.exports = {
    User: require('../schema/user.schema'),

    findGame, 
    makeGame,
    printGames
};

// active games
let games = [];

function findGame(id) {
	for (let i = 0; i < games.length; i++) {
		if (games[i].id === id) {
			return games[i];
		}
	}

	return null;
}

async function makeGame() {

	return new Promise( (resolve) => {

		let id;

		do {
			id = Math.floor(Math.random() * 1000000);
		} while (findGame(id))


		games.push({
			id: id
		});

		resolve(id);
	});
}

async function printGames() {
	for (let i = 0; i < games.length; i++) {
		console.log(games[i]);
	}
}