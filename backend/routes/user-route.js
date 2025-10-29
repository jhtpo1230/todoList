const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const {verifyToken} = require('../middleware/authForJwt');

router.post('/', controller.joinUser);
router.post('/login', controller.loginUser);
router.post('/logout', controller.logoutUser);
router.get('/team', verifyToken, controller.getTeams);

module.exports = router;