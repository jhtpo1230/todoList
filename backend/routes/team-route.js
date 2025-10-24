const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers/teamController');

router.post('/create', controller.createTeam); // jwt 토큰 검증 필요
router.get('/:teamId', controller.getTeamMembers); // jwt 토큰 검증 필요
router.post('/:teamId/invite', controller.inviteTeamMember); // jwt 토큰 검증 필요
router.delete('/:teamId/delete', controller.deleteTeamMember); // jwt 토큰 검증 필요

module.exports = router;