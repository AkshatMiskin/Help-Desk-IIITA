const db = require("../config/db");

const Complaint = {
  createComplaint: (complaint, callback) => {
    const { type, rollNumber, description, building, room } = complaint;

    const sql = `
      INSERT INTO complaints 
      (type, rollNumber, description, building, room) 
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [type, rollNumber, description, building, room], callback);
  },

  // Get all complaints (for admin)
  getAll: (callback) => {
    db.query("SELECT * FROM complaints", callback);
  },

  // Assign personnel to complaint
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
