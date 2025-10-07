const express = require('express');
const router = express.Router();
const controller = require('../controllers/todo');

router.post('/', controller.createTodo);
router.put('/:id', controller.updateTodo);
router.delete('/:id', controller.deleteTodo);

module.exports = router;