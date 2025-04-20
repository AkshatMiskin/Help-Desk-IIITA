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
  createComplaint: async (complaint, callback) => {
    const {
      name,
      email,
      priority,
      location,
      type,
      message,
      attachments,
    } = complaint;
    const code = generateCode();
    const getComplaintTypeIdSql = `SELECT id FROM complaint_types WHERE type_name = ?`;
db.query(getComplaintTypeIdSql, [type], (err, typeResults) => {
  if (err) return callback(err);
  if (typeResults.length === 0) {
    return callback(new Error("Invalid complaint type"));
  }

  const complaint_type_id = typeResults[0].id;

  const getUserIdSql = `SELECT id FROM users WHERE email = ?`;
  db.query(getUserIdSql, [email], (err, userResults) => {
    if (err) return callback(err);
    if (userResults.length === 0) {
      return callback(new Error("User not found"));
    }

    const user_id = userResults[0].id;

    const insertSql = `
      INSERT INTO complaints 
      (name, email, priority, location, complaint_type_id, message, attachments, code, user_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      insertSql,
      [name, email, priority, location, complaint_type_id, message, attachments, code, user_id],
      callback
    );
  });
});


    await transporter.sendMail({
      from: "iit2023219@iiita.ac.in",
      to: email,
      subject: "IIITA Help Desk - Ticket Submitted",
      html: `
        <h2>Your Ticket Has Been Submitted</h2>
        <p>Hi <span style="font-size: 1.1rem; color:rgb(85, 235, 15)">${name}</span>,</p>
        <p>Thank you for submitting your issue to the IIITA Help Desk.</p>
        <p>Your complaint for <span style="font-size: 1.2rem; color:rgb(239, 51, 67)">${type}</span> is noted.</p>
        <p><strong>Your Ticket Code:</strong> <span style="font-size: 1.2rem; color: #4f46e5">${code}</span></p>
        <p>Use this code for future reference.</p>
        <br />
        <p>Regards,<br />IIITA Help Desk Team</p>
      `,
    });
  },
<<<<<<< HEAD

=======
  
>>>>>>> 9b48ac8ef3084ad38fd2288f33cbf776950fe3d4
  getAll: (callback) => {
    db.query(`
      SELECT 
        c.*, 
        p.name AS assigned_name, 
        p.contact AS assigned_contact,
        ct.type_name AS complaint_type
      FROM complaints c
      LEFT JOIN personnel p ON c.assigned_personnel_id = p.id
      LEFT JOIN complaint_types ct ON c.complaint_type_id = ct.id
    `, callback);
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
