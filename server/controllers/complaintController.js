const Complaint = require('../models/complaintModel');
const db = require("../config/db");
const getComplaintTypeId = `
  SELECT id FROM complaint_types WHERE type_name = ?
`;

exports.submitComplaint = (req, res) => {
  const { name, email, priority, location, type, message } = req.body;

  if (!name || !email || !priority || !location  || !type || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please fill all required fields',
    });
  }
  // Extract filenames from uploaded files
  const attachments = req.files?.map((file) => file.filename).join(",") || "";
  const complaint = {
    name,
    email,
    priority,
    location,
    type,
    message,
    attachments: attachments || null,
  };

  Complaint.createComplaint(complaint, (err, result) => {
    if (err) {
      console.error('Error creating complaint:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while submitting complaint',
      });
    }

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
    });
  });
};

exports.getAllComplaints = (req, res) => {
  Complaint.getAll((err, results) => {
    if (err) {
      console.error('Error fetching complaints:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch complaints',
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
};

exports.assignPersonnel = (req, res) => {
  const id = req.params.id;
  const { assignedName, assignedContact } = req.body;

  if (!assignedName || !assignedContact) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both name and contact of personnel',
    });
  }

  Complaint.assign(id, { assignedName, assignedContact }, (err, result) => {
    if (err) {
      console.error('Error assigning personnel:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to assign personnel',
      });
    }

    res.json({
      success: true,
      message: 'Personnel assigned successfully',
    });
  });
};

exports.getComplaintsByUser = (req, res) => {
  const email = req.params.email;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required',
    });
  }

  Complaint.getByEmail(email, (err, results) => {
    if (err) {
      console.error('Error fetching user complaints:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch user complaints',
      });
    }

    res.json({
      success: true,
      data: results,
    });
  });
};

exports.deleteComplaint = (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM complaints WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting complaint:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Complaint not found" });
    }

    return res.json({ success: true, message: "Complaint deleted successfully" });
  });
};
