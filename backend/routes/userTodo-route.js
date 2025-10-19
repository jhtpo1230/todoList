const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers/userTodoController');
const {checkUserExist} = require('../middleware/checkUserExist');
const {verifyToken} = require('../middleware/authForJwt');

router.get('/', checkUserExist, verifyToken, controller.getTodos);
router.post('/', checkUserExist, verifyToken, controller.createTodo);
router.put('/:id', checkUserExist, verifyToken, controller.updateTodo);
router.delete('/:id', checkUserExist, verifyToken, controller.deleteTodo);
router.patch('/:id/complete', checkUserExist, verifyToken, controller.todoComplete);

module.exports = router;