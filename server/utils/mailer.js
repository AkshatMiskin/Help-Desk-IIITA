// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

/**
 * Sends an email using Nodemailer transporter
 * @param {Object} options - mail options like { to, subject, html }
 * @returns {Promise}
 */
const sendMail = (options) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.EMAIL,
        ...options,
      },
      (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      }
    );
  });
};

/**
 * Generates the HTML content for ticket submission email
 * @param {string} name - User's name
 * @param {string} type - Complaint type
 * @param {string} code - Ticket code
 * @returns {string} - HTML string
 */
const generateTicketSubmissionHTML = (name, type, code) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #4f46e5;">Your Ticket Has Been Submitted</h2>
      <p>Hi <span style="font-size: 1.1rem; color: rgb(85, 235, 15);">${name}</span>,</p>
      <p>Your complaint regarding <span style="font-size: 1.2rem; color: rgb(239, 51, 67);">${type}</span> has been recorded.</p>
      <p><strong>Your Ticket Code:</strong> <span style="font-size: 1.2rem; color: #4f46e5;">${code}</span></p>
      <p style="margin-top: 20px;">We will get back to you shortly.</p>
      <br>
      <p style="font-size: 0.9rem; color: gray;">Thank you,<br>IIITA Help Desk Team</p>
    </div>
  `;
};

/**
 * Sends a predefined ticket submission mail
 * @param {string} email - Receiver's email
 * @param {string} name - User's name
 * @param {string} type - Complaint type
 * @param {string} code - Ticket code
 * @returns {Promise}
 */
const sendTicketSubmissionMail = (email, name, type, code) => {
  const htmlContent = generateTicketSubmissionHTML(name, type, code);

  return sendMail({
    to: email,
    subject: "IIITA Help Desk - Ticket Submitted",
    html: htmlContent,
  });
};

module.exports = { sendMail, sendTicketSubmissionMail };
