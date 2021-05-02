const userService = require('../services/user.service');

module.exports = {
    authenticate,
    register, 
    getStats
};

function authenticate(req, res, next) {
    console.log("Authenticate():", req.body);
       userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
} 

function register(req, res, next) {
	console.log(req.body);
    userService.addUser(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getStats(req,res,next){
    userService.getStats()
        .then(user => res.json(user))
        .catch(err => next(err));
}

