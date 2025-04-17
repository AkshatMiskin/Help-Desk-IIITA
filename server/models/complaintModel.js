const db = require("../config/db");

const Complaint = {
  createComplaint: (complaint, callback) => {
    const {
      name,
      email,
      priority,
      location,
      subject,
      message,
      attachments,
    } = complaint;

    const sql = `
      INSERT INTO complaints 
      (name, email, priority, location, subject, message, attachments) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, priority, location, subject, message, attachments], callback);
  },

  getAll: (callback) => {
    db.query("SELECT * FROM complaints", callback);
  },

  assign: (id, personnel, callback) => {
    const sql = `
      UPDATE complaints 
      SET assignedName = ?, assignedContact = ?, status = 'Assigned', updatedAt = NOW() 
      WHERE id = ?
    `;
    db.query(sql, [personnel.assignedName, personnel.assignedContact, id], callback);
  },
};

module.exports = Complaint;
