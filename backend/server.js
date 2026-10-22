require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { connectDB, getDbStatus } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const commentRoutes = require('./routes/commentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

connectDB();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/api/health') {
    return next();
  }
  if (mongoose.connection.readyState !== 1) {
    connectDB();
    return res.status(503).json({
      message: 'Database is connecting or temporarily unreachable. Please ensure MongoDB Atlas Network Access allows 0.0.0.0/0.',
      dbStatus: getDbStatus()
    });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/tickets/:ticketId/comments', commentRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Helpdesk API is running' });
});

app.get('/api/health', (req, res) => {
  const dbInfo = getDbStatus();
  res.status(200).json({
    status: 'healthy',
    database: dbInfo.state,
    databaseReady: dbInfo.readyState === 1,
    dbError: dbInfo.error,
    timestamp: new Date().toISOString()
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
