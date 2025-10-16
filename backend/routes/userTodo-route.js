const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/userTodoController');
const {checkUserExist} = require('../middleware/checkUserExist');

router.get('/', checkUserExist, controller.getTodos);
router.post('/', checkUserExist, controller.createTodo);
router.put('/:id', checkUserExist, controller.updateTodo);
router.delete('/:id', checkUserExist, controller.deleteTodo);
router.patch('/:id/complete', checkUserExist, controller.todoComplete);

module.exports = router;