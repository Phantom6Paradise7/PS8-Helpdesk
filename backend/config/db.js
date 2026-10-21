const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb+srv://mansabhatt62587_db_user:48wNMlZjlNr26tYf@cluster7.klfzxyk.mongodb.net/helpdesk?retryWrites=true&w=majority';
  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;