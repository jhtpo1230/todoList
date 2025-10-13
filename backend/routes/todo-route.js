const express = require('express');
const router = express.Router();
const controller = require('../controllers/todo');

router.get('/', controller.getTodos);
router.post('/', controller.createTodo);
router.put('/:id', controller.updateTodo);
router.delete('/:id', controller.deleteTodo);
router.patch('/:id/complete', controller.todoComplete);

module.exports = router;