const db = require("../config/db");
require("dotenv").config();
const generateCode = () => Math.floor(1000 + Math.random() * 9000);
const { sendTicketSubmissionMail } = require("../utils/mailer");

const getAll = (callback) => {
  const sql = `
    SELECT 
      c.*, 
      u.name AS name,
      u.email AS email,
      p.name AS assigned_name, 
      p.contact AS assigned_contact,
      ct.type_name AS complaint_type
    FROM complaints c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN personnel p ON c.assigned_personnel_id = p.id
    LEFT JOIN complaint_types ct ON c.complaint_type_id = ct.id
  `;
  db.query(sql, callback);
};

const createComplaint = async (complaint, callback) => {
  const { name, email, priority, location, type, message, attachments } = complaint;
  const code = generateCode();

  const sql = `
    INSERT INTO complaints 
    (priority, location, complaint_type_id, message, attachments, code, user_id)
    VALUES (
      ?, ?, 
      (SELECT id FROM complaint_types WHERE type_name = ? LIMIT 1),
      ?, ?, ?, 
      (SELECT id FROM users WHERE email = ? LIMIT 1)
    )
  `;

  db.query(
    sql,
    [priority, location, type, message, attachments, code, email],
    async (err, result) => {
      if (err) return callback(err);
      await sendTicketSubmissionMail(email, name, type, code);
      callback(null, result);
    }
  );
};


const getUserComplaint = (email, callback) => {
  db.query("SELECT id FROM users WHERE email = ?", [email], (err, userResults) => {
    if (err) {
      return callback(err, null);
    }
    if (userResults.length === 0) {
      return callback(new Error("User not found"), null);
    }
    const user_id = userResults[0].id; 
    db.query("SELECT * FROM complaints WHERE user_id = ?", [user_id], callback);
  });
};

const assignPersonnel = (id, assignedName, assignedContact, callback) => {
  const fetchPersonnel = `SELECT id FROM personnel WHERE name = ? AND contact = ?`;
  db.query(fetchPersonnel, [assignedName, assignedContact], (err, result) => {
    if (err) return callback(err);
    if (result.length === 0) return callback(null, null);

    const personnelId = result[0].id;

    const updateComplaint = `
      UPDATE complaints 
      SET assigned_personnel_id = ?, status = 'Assigned' 
      WHERE id = ?
    `;
    db.query(updateComplaint, [personnelId, id], (err2) => {
      if (err2) return callback(err2);

      const updatePersonnel = `UPDATE personnel SET available = 0 WHERE id = ?`;
      db.query(updatePersonnel, [personnelId], (err3) => {
        if (err3) return callback(err3);
        callback(null, true);
      });
    });
  });
};

const markResolved = (id, callback) => {
  const getPersonnel = "SELECT assigned_personnel_id FROM complaints WHERE id = ?";
  db.query(getPersonnel, [id], (err, result) => {
    if (err || result.length === 0) return callback(err || new Error("Complaint not found"));

    const personnelId = result[0].assigned_personnel_id;
    const updateComplaint = "UPDATE complaints SET status = 'Resolved' WHERE id = ?";

    db.query(updateComplaint, [id], (err) => {
      if (err) return callback(err);

      if (personnelId) {
        const updatePersonnel = "UPDATE personnel SET available = 1 WHERE id = ?";
        db.query(updatePersonnel, [personnelId], callback);
      } else {
        callback(null, true);
      }
    });
  });
};

const trackTicket = (email, code, callback) => {
  const sql = `
    SELECT c.status, 
            p.name AS personnel_name, 
            p.contact AS personnel_contact 
    FROM complaints c 
    LEFT JOIN personnel p ON c.assigned_personnel_id = p.id 
    WHERE c.email = ? AND c.code = ?
  `;
  db.query(sql, [email, code], callback);
};

const getComplaintTypes = (callback) => {
  const query = "SELECT id, type_name FROM complaint_types";
  db.query(query, callback);
};

module.exports = {
  getAll, 
  createComplaint, 
  getUserComplaint, 
  assignPersonnel, 
  markResolved, 
  trackTicket, 
  getComplaintTypes
};
