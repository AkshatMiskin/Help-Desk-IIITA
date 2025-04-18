const db = require("../config/db");

const Complaint = {
  createComplaint: (complaint, callback) => {
    const {
      name,
      email,
      priority,
      location,
      type,
      message,
      attachments,
    } = complaint;

    const sql = `
      INSERT INTO complaints 
      (name, email, priority, location, type, message, attachments) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, priority, location, type, message, attachments], callback);
  },

  // const result = await ;

  getAll: (callback) => {
    db.query(`
      SELECT c.*, p.name AS assigned_name, p.contact AS assigned_contact
      FROM complaints c
      LEFT JOIN personnel p ON c.assigned_personnel_id = p.id
    `, callback);
    // db.query("SELECT * FROM complaints", callback);
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
