const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/join', controller.joinUser);
router.post('/login', controller.loginUser);

module.exports = router;