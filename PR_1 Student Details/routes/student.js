const express = require('express');
const router = express.Router();
const controller = require('../controller/student');

// Routes with proper structure
router.get('/', controller.getAllStudents);
router.get('/add', controller.getAddStudent);
router.post('/add', controller.upload.single('image'), controller.createStudent);
router.get('/edit/:id', controller.getEditStudent);
router.post('/edit/:id', controller.upload.single('image'), controller.updateStudent);
router.get('/view/:id', controller.getSingleStudent);
router.post('/delete/:id', controller.deleteStudent);

module.exports = router;