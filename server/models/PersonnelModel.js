const db = require("../config/db");

const Personnel = {
  getAll: (callback) => {
    db.query("SELECT * FROM personnel", callback);
  },

  getAvailableByRole: (role, callback) => {
    db.query("SELECT * FROM personnel WHERE role = ? AND available = TRUE", [role], callback);
  },

  assignPersonnel: (id, callback) => {
    db.query("UPDATE personnel SET available = FALSE WHERE id = ?", [id], callback);
  },

  releasePersonnel: (id, callback) => {
    db.query("UPDATE personnel SET available = TRUE WHERE id = ?", [id], callback);
  },

  addPersonnel: (person, callback) => {
    const sql = `INSERT INTO personnel (name, contact, role, email) VALUES (?, ?, ?, ?)`;
    db.query(sql, [person.name, person.contact, person.role, person.email], callback);
  }
};

module.exports = Personnel;
