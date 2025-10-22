const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers/userTodoController');
const {checkUserExist} = require('../middleware/checkUserExist');
const {verifyToken} = require('../middleware/authForJwt');

router.get('/:userId/todos', verifyToken, checkUserExist, controller.getTodos);
router.post('/:userId/todos', verifyToken, checkUserExist, controller.createTodo);
router.put('/:userId/todos/:id', verifyToken, checkUserExist, controller.updateTodo);
router.delete('/:userId/todos/:id', verifyToken, checkUserExist, controller.deleteTodo);
router.patch('/:userId/todos/:id/complete', verifyToken, checkUserExist, controller.todoComplete);

router.get('/:userId/team', controller.getTeams); // jwt 토큰 검증 코드 추가 필요

module.exports = router;