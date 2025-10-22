require('dotenv').config();
const express = require('express');
const userTodoRoutes = require('./routes/userTodo-route');
const userRoutes = require('./routes/user-route');
const { swaggerUi, swaggerFile } = require('./swagger/swagger');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://todo-list-gamma-opal-93.vercel.app' : 'http://localhost:3000'
}));

app.use('/users/:userId/todos', userTodoRoutes);
app.use('/user', userRoutes);

app.use('/swagger_todoAPI', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
);