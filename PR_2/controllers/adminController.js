const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.register = async (req, res) => {
  try {
    const { username, email, password, confirm_password, status } = req.body;
    if (password !== confirm_password) return res.status(400).json({ error: "Passwords do not match" });

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = new Admin({
      username,
      email,
      password: hashed,
      status,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    });

    await admin.save();
    res.status(201).json({ message: "Admin registered" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};