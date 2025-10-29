require('dotenv').config();
const express = require('express');
const todoRoutes = require('./routes/todo-route');
const userRoutes = require('./routes/user-route');
const teamRoutes = require('./routes/team-route');
const { swaggerUi, swaggerFile } = require('./swagger/swagger');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors({
    origin: ['https://todolist-red-zeta-98.vercel.app', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/todos', todoRoutes);
app.use('/users', userRoutes);
app.use('/teams', teamRoutes);

app.use('/swagger_todoAPI', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.listen(process.env.PORT, () =>
    console.log(`Server running on http://localhost:${process.env.PORT}`)
);