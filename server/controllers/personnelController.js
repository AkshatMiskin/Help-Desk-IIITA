const Personnel = require("../models/PersonnelModel");

const getPersonnels = (req, res) => {
  Personnel.getAll((err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching personnel" });
    res.json({ success: true, data: result });
  });
};

const getAvailablePersonnels = (req, res) => {
  const role = req.params.role;
  Personnel.getAvailableByRole(role, (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Error fetching available personnel" });
    res.json({ success: true, data: result });
  });
};

const addPersonnels = (req, res) => {
  const { name, contact, role } = req.body;

  if (!name || !contact || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  Personnel.addPersonnel({ name, contact, role }, (err) => {
    if (err) {
      console.error("Error adding personnel:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    res.json({ success: true, message: "Personnel added successfully" });
  });
};

module.exports = { getPersonnels, getAvailablePersonnels, addPersonnels };
