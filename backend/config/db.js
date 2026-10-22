const mongoose = require('mongoose');

let isConnecting = false;
let lastDbError = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1 || isConnecting) {
    return;
  }

  const uri = process.env.MONGO_URI || 'mongodb+srv://mansabhatt62587_db_user:48wNMlZjlNr26tYf@cluster7.klfzxyk.mongodb.net/helpdesk?retryWrites=true&w=majority';

  isConnecting = true;
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4
    });
    lastDbError = null;
    isConnecting = false;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    lastDbError = error.message;
    isConnecting = false;
    console.error(`Database Connection Error: ${error.message}`);
    setTimeout(connectDB, 5000);
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
  setTimeout(connectDB, 5000);
});

mongoose.connection.on('error', (err) => {
  lastDbError = err.message;
  console.error(`MongoDB error: ${err.message}`);
});

const getDbStatus = () => {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    error: lastDbError
  };
};

module.exports = { connectDB, getDbStatus };