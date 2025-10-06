require('dotenv').config();
const express = require('express');
const todoRoutes = require('./routes/todo-route');
const { swaggerUi, specs } = require('./swagger/swagger');

const app = express();
app.use(express.json());

// 라우트 등록
app.use('/todo', todoRoutes);

// Swagger UI 등록
app.use('/swagger_todoAPI', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(process.env.PORT, () =>
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`)
);