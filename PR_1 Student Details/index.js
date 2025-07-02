const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/student');

require('dotenv').config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/studentdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Routes - IMPORTANT: Mount routes at /students
app.use('/students', router);

// Root redirect
app.get('/', (req, res) => {
  res.redirect('/students');
});

// 404 handler - redirect to students list with flash message
app.use((req, res) => {
  res.redirect('/students?error=Page not found');
});

// Error handler - redirect to students list with error message
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.redirect('/students?error=Something went wrong! Please try again.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Student management available at: http://localhost:${PORT}/students`);
});