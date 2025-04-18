const { findUser, findAdmin, createUser, findUserByEmail  } = require('../models/userModel');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const SECRET_KEY = process.env.SECRET_KEY; 

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for admin login first
    const adminResults = await new Promise((resolve, reject) => {
      findAdmin(email, password, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (adminResults.length > 0) {
      const token = jwt.sign({ name: "Admin", email, isAdmin: true }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ success: true, token });
    }

    // If not admin, check for user login
    const userResults = await new Promise((resolve, reject) => {
      findUser(email, password, (err, results) => {
        if (err) reject(err);
        else resolve(results);
      });
    });

    if (userResults.length > 0) {
      const user = userResults[0];
      const token = jwt.sign({ name: user.name, email: user.email, isAdmin: false }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ success: true, token });
    }

    // If neither admin nor user matched
    return res.status(401).json({ success: false, message: "Invalid credentials" });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};



const signup = (req, res) => {
  const { name, email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    createUser(name, email, password, (err2) => {
      if (err2) return res.status(500).json({ success: false, error: err2 });

      const token = jwt.sign({ name, email, isAdmin: false }, SECRET_KEY, { expiresIn: '1h' });

      return res.json({
        success: true,
        message: "User registered successfully",
        token,
        user: { name, email, isAdmin: false },
      });
    });
  });
};

module.exports = { login, signup };
