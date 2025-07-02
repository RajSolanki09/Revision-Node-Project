
const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  status: {
    type: Boolean,
    default: true
  },
  created_date: {
    type: String,
    default: () => new Date().toISOString()
  },
  updated_date: {
    type: String,
    default: () => new Date().toISOString()
  }
});

module.exports = mongoose.model('Admin', adminSchema);