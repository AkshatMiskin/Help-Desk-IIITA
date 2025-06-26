const db = require('../config/db');

const saveChatMessage = async (userId, message, fromRole) => {
  try {
    const query = 'INSERT INTO chat (user_id, message, from_role) VALUES (?, ?, ?)';
    const values = [userId, message, fromRole];

    await db.promise().query(query, values); 
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error; 
  }
};
module.exports = saveChatMessage;