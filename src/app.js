const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔥 Swagger MUST be before routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Welcome to TukTracer API',
    documentation: 'http://localhost:5000/api-docs'
  });
});

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
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API routes
app.use('/api', locationRoutes);
app.use('/api/auth', authRoutes);

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;