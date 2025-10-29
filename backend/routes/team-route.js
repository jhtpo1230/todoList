const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/teamController');
const {verifyToken} = require('../middleware/authForJwt');

router.post('/', verifyToken, controller.createTeam);
router.delete('/:teamId', controller.deleteTeam);
router.get('/:teamId', controller.getTeamMembers); 
router.post('/:teamId/members', controller.inviteTeamMember);
router.delete('/:teamId/members/:userId', controller.deleteTeamMember);

module.exports = router;