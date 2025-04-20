// routes/personnel.js
const express = require("express");
const router = express.Router();
const Personnel = require("../models/PersonnelModel");
const db = require('../config/db');

router.get("/", (req, res) => {
  Personnel.getAll((err, result) => {
    if (err) return res.json({ success: false, message: "Error fetching personnel" });
    res.json({ success: true, data: result });
  });
});

router.get("/available/:role", (req, res) => {
  const role = req.params.role;
  Personnel.getAvailableByRole(role, (err, result) => {
    if (err) return res.json({ success: false, message: "Error fetching available personnel" });
    res.json({ success: true, data: result });
  });
});

router.post("/", async (req, res) => {
  const { name, contact, role } = req.body;
  if (!name || !contact || !role) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }
  try {
    const query = "INSERT INTO personnel (name, contact, role, available) VALUES (?, ?, ?, ?)";
    const values = [name, contact, role, true];

    await db.execute(query, values); // or db.query, depending on your connection setup

    res.json({ success: true, message: "Personnel added successfully" });
  } catch (err) {
    console.error("Error adding personnel:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
