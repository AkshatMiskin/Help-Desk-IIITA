const {
  createUser,
  findUserByEmail,
  getUserDetailsByEmail,
  checkExistingFeedback,
  insertFeedback
} = require('../models/userModel');
const jwt = require('jsonwebtoken');
require("dotenv").config();
const bcrypt = require('bcrypt');
const SECRET_KEY = process.env.SECRET_KEY; 

const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: "Database error" 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid credentials" 
      });
    }

    const user = results[0];

    // Compare hashed password
    bcrypt.compare(password, user.password, (compareErr, isMatch) => {
      if (compareErr || !isMatch) {
        return res.status(401).json({ 
          success: false, 
          message: "Invalid credentials" 
        });
      }

      const token = jwt.sign({ 
        name: user.name, 
        email: user.email, 
        isAdmin: user.role === 'admin' 
      },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return res.json({ 
        success: true, 
        token 
      });
    });
  });
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    findUserByEmail(email, (err, results) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: "Database error" 
        });
      }

      if (results.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: "User already exists" 
        });
      }

      createUser(name, email, hashedPassword, 'user', (err2) => {
        if (err2) {
          return res.status(500).json({ 
            success: false, 
            error: "Failed to create user" 
          });
        }

        const token = jwt.sign({ name, email, isAdmin: false }, SECRET_KEY, { expiresIn: '1h' });

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
          token,
          user: { name, email, isAdmin: false },
        });
      });
    });
  } catch (err) {
      return res.status(500).json({ 
        success: false, 
        error: "Something went wrong" 
      });
    }
};

const userDetails = (req, res) => {
  const { email } = req.params;

  getUserDetailsByEmail(email, (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Server error" 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({ 
      success: true, 
      user: results[0] 
    });
  });
};

const feedback = (req, res) => {
  const { complaint_id, user_id, assigned_personnel_id, rating, comment } = req.body;
  console.log("Received feedback submission:", req.body);

  if (!complaint_id || !user_id || !assigned_personnel_id || !rating) {
    return res.status(400).json({ 
      success: false, 
      message: "Missing required fields." 
    });
  }

  checkExistingFeedback(complaint_id, (err, existing) => {
    if (err) {
      console.error("Error checking existing feedback:", err);
      return res.status(500).json({ 
        success: false, 
        message: "Server error." 
      });
    }

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Feedback already submitted." 
      });
    }

    insertFeedback(complaint_id, user_id, assigned_personnel_id, rating, comment, (err2) => {
      if (err2) {
        console.error("Error inserting feedback:", err2);
        return res.status(500).json({ 
          success: false, 
          message: "Failed to submit feedback." 
        });
      }

      return res.status(200).json({ 
        success: true, 
        message: "Feedback submitted successfully." 
      });
    });
  });
};

module.exports = { login, signup, userDetails, feedback };
