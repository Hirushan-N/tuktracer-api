const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const locationRoutes = require('./routes/locationRoutes');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @swagger
 * /:
 *   get:
 *     summary: API welcome route
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to TukTracer API',
    environment: process.env.NODE_ENV || 'development'
  });
});

/**
 * @swagger
 * /api/test-db:
 *   get:
 *     summary: Test database connection
 *     tags: [System]
 *     responses:
 *       200:
 *         description: Database connection successful
 *       500:
 *         description: Database connection failed
 */
app.get('/api/test-db', async (req, res) => {
  try {
    const prisma = require('./config/prisma');
    const result = await prisma.$queryRaw`SELECT NOW()`;

    return res.status(200).json({
      success: true,
      message: 'Database connection successful',
      data: result
    });
  } catch (error) {
    console.error('Database test error:', error);

    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to TukTracer API',
    environment: process.env.NODE_ENV || 'development',
    documentation: 'http://localhost:5000/api-docs'
  });
});

app.use('/api', locationRoutes);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;