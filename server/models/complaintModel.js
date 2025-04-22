const db = require("../config/db");
require("dotenv").config();
const nodemailer = require("nodemailer");

const generateCode = () => Math.floor(1000 + Math.random() * 9000);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const Complaint = {
  getAll: (callback) => {
    const sql = `
      SELECT 
        c.*, 
        p.name AS assigned_name, 
        p.contact AS assigned_contact,
        ct.type_name AS complaint_type
      FROM complaints c
      LEFT JOIN personnel p ON c.assigned_personnel_id = p.id
      LEFT JOIN complaint_types ct ON c.complaint_type_id = ct.id
    `;
    db.query(sql, callback);
  },
  createComplaint: async (complaint, callback) => {
    const {name,email,priority,location,type,message,attachments} = complaint;
    const code = generateCode();

    const getComplaintTypeIdSql = `SELECT id FROM complaint_types WHERE type_name = ?`;
    db.query(getComplaintTypeIdSql, [type], (err, typeResults) => {
      if (err) return callback(err);
      if (typeResults.length === 0) return callback(new Error("Invalid complaint type"));

      const complaint_type_id = typeResults[0].id;

      const getUserIdSql = `SELECT id FROM users WHERE email = ?`;
      db.query(getUserIdSql, [email], (err, userResults) => {
        if (err) return callback(err);
        if (userResults.length === 0) return callback(new Error("User not found"));

        const user_id = userResults[0].id;

        const insertSql = `
          INSERT INTO complaints 
          (priority, location, complaint_type_id, message, attachments, code, user_id) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
          insertSql,
          [priority, location, complaint_type_id, message, attachments, code, user_id],
          (err, result) => {
            if (err) return callback(err);
            transporter.sendMail({
              from: process.env.EMAIL,
              to: email,
              subject: "IIITA Help Desk - Ticket Submitted",
              html: `
                <h2>Your Ticket Has Been Submitted</h2>
                <p>Hi <span style="font-size: 1.1rem; color:rgb(85, 235, 15)">${name}</span>,</p>
                <p>Your complaint for <span style="font-size: 1.2rem; color:rgb(239, 51, 67)">${type}</span> is noted.</p>
                <p><strong>Your Ticket Code:</strong> <span style="font-size: 1.2rem; color: #4f46e5">${code}</span></p>
              `,
            });
            callback(null, result);
          }
        );
      });
    });
  },

  getUserComplaints: (email, callback) => {
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
  },

  assignPersonnel: (id, assignedName, assignedContact, callback) => {
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
  },

  markResolved: (id, callback) => {
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
  },

  trackTicket: (email, code, callback) => {
    const sql = `
      SELECT c.status, 
             p.name AS personnel_name, 
             p.contact AS personnel_contact 
      FROM complaints c 
      LEFT JOIN personnel p ON c.assigned_personnel_id = p.id 
      WHERE c.email = ? AND c.code = ?
    `;
    db.query(sql, [email, code], callback);
  },

  getComplaintTypes: (callback) => {
    const query = "SELECT id, type_name FROM complaint_types";
    db.query(query, callback);
  },
};

module.exports = Complaint;
