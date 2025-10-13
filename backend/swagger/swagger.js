require('dotenv').config({ path: '../.env' });
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TodoList API',
            version: '1.0.0',
            description: 'Todo CRUD API 문서'
        },
        servers: [
            { url: `http://localhost:${process.env.PORT}` }
        ]
    },
    apis: ['./swagger-docs/*.yaml'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
console.log('Swagger spec loaded:', Object.keys(specs));