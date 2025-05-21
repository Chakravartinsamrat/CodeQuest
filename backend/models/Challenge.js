// models/Challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  hint: {
    type: String,
    default: ''
  },
  xp: {
    type: Number,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Challenge', challengeSchema);
