const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/todoController');
const {verifyToken} = require('../middleware/authForJwt');

router.get('/', verifyToken, controller.getTodos);
router.post('/', verifyToken, controller.createTodo);
router.put('/:todoId', verifyToken, controller.updateTodo);
router.delete('/:todoId', verifyToken, controller.deleteTodo);

module.exports = router;