require('dotenv').config({ path: '../.env' });
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TodoList API',
            version: '1.2.0',
            description: 'Todo CRUD API 문서 - userTodo 수정 버전'
        },
        servers: [
            { url: '/' },
            // { url: `http://localhost:${process.env.PORT}`, description: 'Local server' },
            // { url: '${process.env.VERCEL_URL}', description: 'Production server' }
        ]
    },
    apis: [path.resolve(__dirname, '../swagger-docs/*.yaml')]
};

const swaggerFile = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerFile };