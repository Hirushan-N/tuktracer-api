const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const locationRoutes = require('./routes/locationRoutes');
const authRoutes = require('./routes/authRoutes');
const tukTukRoutes = require('./routes/tukTukRoutes');
const driverRoutes = require('./routes/driverRoutes');
const deviceRoutes = require('./routes/deviceRoutes');

const swaggerSpec = require('./docs/swagger');

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TukTracer API running',
    docs: 'http://localhost:5000/api-docs'
  });
});

app.use('/api', locationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', tukTukRoutes);
app.use('/api', driverRoutes);
app.use('/api', deviceRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;