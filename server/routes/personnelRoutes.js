// routes/personnel.js
const express = require("express");
const router = express.Router();
const Personnel = require("../models/PersonnelModel");

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

module.exports = router;
