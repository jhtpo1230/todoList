const express = require('express');
const router = express.Router();

const controller = require('../controllers/teamController');

router.post('/create', controller.createTeam); // jwt 토큰 검증 필요

module.exports = router;