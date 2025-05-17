// models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  challenges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    }
  ],
  createdBy: {
    type: String,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
