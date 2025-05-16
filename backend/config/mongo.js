const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_STRING);

    console.log(`Database Connected`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit on failure
  }
};

module.exports = connectDB;
