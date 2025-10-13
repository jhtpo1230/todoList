const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.post('/', controller.joinUser);

module.exports = router;