const swaggerJsDoc = require('swagger-jsdoc');

const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || 'secret_key';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'JWT Authentication API',
            version: '1.0.0',
            description: 'API for user authentication using JWT',
        },
        servers: [
            {
                url: `http://${SERVER_HOST}:${SERVER_PORT}`,
            },
        ],
        components: {
            securitySchemes: {
              jwtAuth: {
                type: 'jwtSecret',
                in: 'header',
                name: 'Authorization',
                description: 'JWT token without Bearer prefix',
              },
            },
          },
          security: [
            {
              jwtAuth: [], // Apply this globally, or you can apply per-route
            },
          ],
        },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
