// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  topics: {
    type: [String],
    default: []
  },
  createdBy: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);