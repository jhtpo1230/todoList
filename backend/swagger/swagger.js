require('dotenv').config({ path: '../.env' });
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TodoList API',
            version: '1.1.0',
            description: 'Todo CRUD API 문서 - 팀 생성 추가 버전'
        },
        servers: [{ url: '/' }],
    },

    apis: ['./swagger-docs/*.yaml']
};

const swaggerFile = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerFile };