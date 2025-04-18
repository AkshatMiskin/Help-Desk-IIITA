const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const verifyToken = require('../middleware/auth');
const db = require("../config/db");

router.post('/login', login);
router.post('/signup', signup);
router.get("/users/:email", (req, res) => {
  const { email } = req.params;

  const query = "SELECT name, email FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: results[0] });
  });
});

module.exports = router;
