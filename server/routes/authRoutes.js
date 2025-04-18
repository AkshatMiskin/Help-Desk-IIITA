const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

// route.get('/protected', verifyToken, (req, res) => {
//   res.json({ success: true, message: "You are authorized", user: req.user });
// });

router.post('/login', verifyToken, login);
router.post('/signup', signup);

module.exports = router;
