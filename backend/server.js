require('dotenv').config();
const express = require('express');
const userTodoRoutes = require('./routes/userTodo-route');
const userRoutes = require('./routes/user-route');
const { swaggerUi, specs } = require('./swagger/swagger');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({origin : 'http://localhost:3000'}));

app.use('/users/:userId/todos', userTodoRoutes);
app.use('/user', userRoutes);

app.use('/swagger_todoAPI', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
);