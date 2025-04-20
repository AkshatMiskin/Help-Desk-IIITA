const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const { complaint_id, user_id, assigned_personnel_id, rating, comment } = req.body;
  console.log("Received feedback submission:", req.body);

  if (!complaint_id || !user_id || !assigned_personnel_id || !rating) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  const checkExistingSql = `SELECT id FROM feedback WHERE complaint_id = ?`;
  db.query(checkExistingSql, [complaint_id], (err, existing) => {
    // console.log(checkExistingSql);
    if (err) {
      
      console.error("Error checking existing feedback:", err);
      return res.status(500).json({ success: false, message: "Server error." });
    }
    
    if (existing.length > 0) {
      console.log('here');
      return res.status(400).json({ success: false, message: "Feedback already submitted." });
    }
    
    const insertSql = `
      INSERT INTO feedback (complaint_id, user_id, assigned_personnel_id, rating, comment)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [complaint_id, user_id, assigned_personnel_id, rating, comment],
      (err) => {
        if (err) {
          console.error("Error inserting feedback:", err);
          return res.status(500).json({ success: false, message: "Failed to submit feedback." });
        }

        return res.status(200).json({ success: true, message: "Feedback submitted successfully." });
      }
    );
  });
});

module.exports = router;
