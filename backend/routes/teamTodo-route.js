const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers/teamTodoController');

router.get('/:teamId/todos', controller.getTodos);
router.post('/:teamId/todos', controller.createTodo);
router.put('/:teamId/todos/:id', controller.updateTodo);
router.delete('/:teamId/todos/:id', controller.deleteTodo);
router.patch('/:teamId/todos/:id/complete', controller.todoComplete);
router.delete('/:teamId', controller.deleteTeam);

module.exports = router;