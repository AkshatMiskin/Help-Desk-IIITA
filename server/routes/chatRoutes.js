const express = require('express');
const router = express.Router();
const saveChatMessage = require("../controllers/chatController")
const db = require('../config/db');

router.post('/', async (req, res) => {
  const { userId, message, from_role } = req.body;
  console.log(req.body);
  if (!userId || !message || !from_role) {
    return res.status(400).json({ 
      success: false, 
      message: 'All fields are required.' 
    });
  }

  try {
    await saveChatMessage(userId, message, from_role);
    return res.status(200).json({ success: true, message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error saving chat message:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
}
);

router.get('/', async (req, res) => {
  const userId = req.query.user_id;
  const limit = parseInt(req.query.limit) || 20;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'user_id is required.' });
  }

  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM chat WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    // Return messages sorted oldest to newest
    rows.reverse();
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error.' 
    });
  }
});

// Get all users who have chatted before
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT DISTINCT users.id, users.name, users.email
       FROM chat
       JOIN users ON chat.user_id = users.id
       ORDER BY users.name`
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error.' 
    });
  }
});

// ...existing code...
module.exports = router;
