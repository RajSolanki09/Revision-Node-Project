const Manager = require("../models/Manager");

exports.addManager = async (req, res) => {
  try {
    const manager = new Manager({
      ...req.body,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    });
    await manager.save();
    res.status(201).json({ message: "Manager added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllManagers = async (req, res) => {
  try {
    const managers = await Manager.find();
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteManager = async (req, res) => {
  try {
    await Manager.findByIdAndDelete(req.params.id);
    res.json({ message: "Manager deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateManager = async (req, res) => {
  try {
    await Manager.findByIdAndUpdate(req.params.id, { ...req.body, updated_date: new Date().toISOString() });
    res.json({ message: "Manager updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchManagers = async (req, res) => {
  try {
    const query = req.query.query;
    const results = await Manager.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } }
      ]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaginatedManagers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const managers = await Manager.find()
      .skip((page - 1) * limit)
      .limit(limit);
    res.json(managers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMultipleManagers = async (req, res) => {
  try {
    const { ids } = req.body;
    await Manager.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Managers deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};