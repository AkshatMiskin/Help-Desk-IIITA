const db = require("../config/db");
require("dotenv").config();
const nodemailer = require("nodemailer");
const generateCode = () => Math.floor(1000 + Math.random() * 9000);
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,         // Replace with your email
    pass: process.env.PASSWORD,      // Use App Password if using Gmail
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

    const sql = `
      INSERT INTO complaints 
      (name, email, priority, location, type, message, attachments) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, email, priority, location, type, message, attachments], callback);

    const code = generateCode();
    await transporter.sendMail({
      from: "iit2023219@iiita.ac.in",
      to: email,
      subject: "IIITA Help Desk - Ticket Submitted",
      html: `
        <h2>Your Ticket Has Been Submitted</h2>
        <p>Hi ${name},</p>
        <p>Thank you for submitting your issue to the IIITA Help Desk.</p>
        <p><strong>Your Ticket Code:</strong> <span style="font-size: 1.2rem; color: #4f46e5">${code}</span></p>
        <p>Use this code for future reference.</p>
        <br />
        <p>Regards,<br />IIITA Help Desk Team</p>
      `,
    });
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
