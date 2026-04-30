const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TukTracer API',
      version: '1.0.0',
      description:
        'RESTful API for Real-Time Three-Wheeler (Tuk-Tuk) Tracking and Movement Logging System'
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server'
      }
    ],
    tags: [
      {
        name: 'System',
        description: 'System health and utility endpoints'
      },
      {
        name: 'Locations',
        description: 'Province, district, and police station endpoints'
      },
      {
        name: 'Authentication',
        description: 'Authentication and user identity endpoints'
      },
      {
        name: 'TukTuks',
        description: 'Tuk-tuk management endpoints'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Something went wrong'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/app.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;