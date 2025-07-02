const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  image: String,
  status: Boolean,
  created_date: {
    type: String,
    default: () => new Date().toISOString()
  },
  updated_date: {
    type: String,
    default: () => new Date().toISOString()
  }
});

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;
