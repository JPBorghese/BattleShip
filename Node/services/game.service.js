const db = require('../_helpers/database.js');

module.exports = {
    makeGame
}

async function makeGame() {
    return await db.makeGame();
}