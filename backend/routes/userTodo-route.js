const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers/userTodoController');
const {checkUserExist} = require('../middleware/checkUserExist');
const {verifyToken} = require('../middleware/authForJwt');

router.get('/:userId/todos', checkUserExist, verifyToken, controller.getTodos);
router.post('/:userId/todos', checkUserExist, verifyToken, controller.createTodo);
router.put('/:userId/todos/:id', checkUserExist, verifyToken, controller.updateTodo);
router.delete('/:userId/todos/:id', checkUserExist, verifyToken, controller.deleteTodo);
router.patch('/:userId/todos/:id/complete', checkUserExist, verifyToken, controller.todoComplete);

module.exports = router;