// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  
  level: {
    type: Number,
    default: 1
  },
  xp:{
    type:Number,
    default:1
  },
  npcIDs: {
    type: [String],
    default: [],
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
