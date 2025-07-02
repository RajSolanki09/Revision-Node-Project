const Student = require('../models/student');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads directory exists
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all students with search and pagination
const getAllStudents = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const errorMessage = req.query.error || '';
    const successMessage = req.query.success || '';
    
    // Build search query
    const query = search ? { 
      name: { $regex: search, $options: 'i' } 
    } : {};

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_date: -1 }); // Sort by newest first

    const totalPages = Math.ceil(total / limit);

    res.render('index', {
      students,
      search,
      currentPage: page,
      totalPages,
      errorMessage,
      successMessage
    });
  } catch (err) {
    console.error('Error loading students:', err);
    res.redirect('/students?error=Error loading students. Please try again.');
  }
};

// Show add student form
const getAddStudent = (req, res) => {
  const errorMessage = req.query.error || '';
  res.render('add', { error: errorMessage });
};

// Create new student
const createStudent = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.redirect('/students/add?error=All fields are required');
    }

    // Check if email already exists
    const existingStudent = await Student.findOne({ email: email.trim().toLowerCase() });
    if (existingStudent) {
      // Delete uploaded file if exists
      if (req.file) {
        fs.unlink(path.join('uploads', req.file.filename), () => {});
      }
      return res.redirect('/students/add?error=Email already exists');
    }

    const newStudent = new Student({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      image: req.file ? req.file.filename : null,
      status: true, // Set default status to active
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    });

    await newStudent.save();
    res.redirect('/students?success=Student added successfully!');
  } catch (err) {
    console.error('Error creating student:', err);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), () => {});
    }
    
    res.redirect('/students/add?error=Failed to add student. Please try again.');
  }
};

// Show edit student form
const getEditStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.redirect('/students?error=Student not found');
    }
    const errorMessage = req.query.error || '';
    res.render('edit', { student, error: errorMessage });
  } catch (err) {
    console.error('Error retrieving student:', err);
    res.redirect('/students?error=Error retrieving student');
  }
};

// Update student
const updateStudent = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const student = await Student.findById(req.params.id);
    
    if (!student) {
      return res.redirect('/students?error=Student not found');
    }

    // Validate required fields
    if (!name || !email || !phone) {
      return res.redirect(`/students/edit/${req.params.id}?error=All fields are required`);
    }

    // Check if email already exists (excluding current student)
    const existingStudent = await Student.findOne({ 
      email: email.trim().toLowerCase(), 
      _id: { $ne: req.params.id } 
    });
    
    if (existingStudent) {
      // Delete uploaded file if exists
      if (req.file) {
        fs.unlink(path.join('uploads', req.file.filename), () => {});
      }
      return res.redirect(`/students/edit/${req.params.id}?error=Email already exists`);
    }

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (student.image) {
        const oldImagePath = path.join('uploads', student.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }
      student.image = req.file.filename;
    }

    // Update student data
    student.name = name.trim();
    student.email = email.trim().toLowerCase();
    student.phone = phone.trim();
    student.updated_date = new Date().toISOString();

    await student.save();
    res.redirect('/students?success=Student updated successfully!');
  } catch (err) {
    console.error('Error updating student:', err);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlink(path.join('uploads', req.file.filename), () => {});
    }
    
    res.redirect(`/students/edit/${req.params.id}?error=Failed to update student. Please try again.`);
  }
};

// View single student
const getSingleStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.redirect('/students?error=Student not found');
    }
    res.render('view', { student });
  } catch (err) {
    console.error('Error loading student:', err);
    res.redirect('/students?error=Error loading student');
  }
};

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    
    if (!student) {
      return res.redirect('/students?error=Student not found');
    }

    // Delete associated image file
    if (student.image) {
      const imagePath = path.join('uploads', student.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    res.redirect('/students?success=Student deleted successfully!');
  } catch (err) {
    console.error('Error deleting student:', err);
    res.redirect('/students?error=Failed to delete student');
  }
};

module.exports = {
  getAllStudents,
  getAddStudent,
  createStudent,
  getEditStudent,
  updateStudent,
  getSingleStudent,
  deleteStudent,
  upload
};