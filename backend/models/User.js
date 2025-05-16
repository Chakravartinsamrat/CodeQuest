// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  courses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
      },
      level: {
        type: Number,
        default: 1
      },
      challenges: [
        {
          challenge: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Challenge'
          },
          solved: {
            type: Boolean,
            default: false
          }
        }
      ]
    }
  ],
  level: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
