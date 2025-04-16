const { findUser, createUser, findUserByEmail  } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const SECRET_KEY = "your_secret_key"; 

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check for admin login
  if (email === "admin@iiita.ac.in" && password === "admin") {
    const token = jwt.sign({ name: "Admin", email, isAdmin: true }, SECRET_KEY, { expiresIn: '1h' });
  }  

  // Check for regular user login
  findUser(email, password, (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });

    if (results.length > 0) {
      const user = results[0]; // Assuming the first result is the correct user
      const token = jwt.sign({ name: user.name, email: user.email, isAdmin: false }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
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
