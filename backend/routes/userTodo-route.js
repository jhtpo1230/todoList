const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers/userTodoController');
const {verifyToken} = require('../middleware/authForJwt');

router.get('/todos', verifyToken, controller.getTodos);
router.post('/todos', verifyToken, controller.createTodo);
router.put('/todos/:id', verifyToken, controller.updateTodo);
router.delete('/todos/:id', verifyToken, controller.deleteTodo);

router.get('/team', controller.getTeams);

module.exports = router;