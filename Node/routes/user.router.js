var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller');
//const Role = require('../_helpers/role');
//const authorize = require('../_helpers/authorize');

router.post('/authenticate', userController.authenticate);
router.post('/register', userController.register);

module.exports = router;
