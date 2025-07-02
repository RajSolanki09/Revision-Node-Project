const mongoose = require('mongoose');

const managerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  salary: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true,
    trim: true
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

module.exports = mongoose.model('Manager', managerSchema);

