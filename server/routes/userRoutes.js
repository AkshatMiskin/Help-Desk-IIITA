const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  userDetails, 
  feedback,
  ForgotPassword,
  ResetPassword
} = require('../controllers/userController');

router.post('/login', login);
router.post('/signup', signup);
router.post("/feedback", feedback);
router.get("/users/:email", userDetails);
router.post("/forgot-password", ForgotPassword);
router.post("/reset-password/:token", ResetPassword);

module.exports = router;
