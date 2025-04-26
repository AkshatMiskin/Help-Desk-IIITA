const express = require('express');
const router = express.Router();
const { 
  signup, 
  login, 
  userDetails, 
  feedback 
} = require('../controllers/userController');

router.post('/login', login);
router.post('/signup', signup);
router.get("/users/:email", userDetails);
router.post("/feedback", feedback);

module.exports = router;
