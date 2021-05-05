
const config = require('../config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../_helpers/database.js');
const User = db.User;

module.exports = {
    authenticate,
    addUser, 
    getStats,
    getByUsername,
    updateStats
}

async function getByUsername(username) {
    return await User.find({username:username});
}

async function authenticate({ username, password }) {

    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user._id }, config.secret, { algorithm: 'HS256' });
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function addUser(userParam) {

    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    //initialize score, wins, and loss
    user.score = 0;
    user.wins = 0;
    user.loss = 0;

    // save user
    await user.save();
}

async function getStats() {
    users = await User.find().populate({ path: '_id', select: 'username' });
    let objs = []
    users.forEach(function(user) {
        let obj = {
            "username": user.username, 
            "wins": user.wins,
            "loss": user.loss,
            "score": user.score,
            "ranking": 0,
        }

        objs.push(obj);
    })
    return objs;
}

async function updateStats(username, didWin) {
    let user = await User.findOne({username: username});

    if (didWin) {
        user.wins++;
        user.score += 100;
    } else {
        user.loss++;
        user.score -= 50;
    }

    await user.save();
}
