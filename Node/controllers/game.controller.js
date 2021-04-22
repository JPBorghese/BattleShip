const gameService = require('../services/game.service');

module.exports = {
	makeGame
};

function makeGame(req, res, next) {
    gameService.makeGame()
    	.then(val => res.json(val))
    	.catch(err => next(err));
}
