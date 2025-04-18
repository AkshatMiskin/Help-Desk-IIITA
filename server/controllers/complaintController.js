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
      message: "Ticket submitted and email sent.",
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

  // First, fetch the personnel ID based on name and contact
  const fetchPersonnelQuery = `
    SELECT id FROM personnel WHERE name = ? AND contact = ?
  `;

  db.query(fetchPersonnelQuery, [assignedName, assignedContact], (err, personnelResult) => {
    if (err) {
      console.error('Error fetching personnel:', err);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch personnel',
      });
    }

    if (personnelResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Personnel not found with the given name and contact',
      });
    }

    const personnelId = personnelResult[0].id;

    // Second, update the complaint with the assigned personnel ID
    const updateComplaintQuery = `
      UPDATE complaints
      SET assigned_personnel_id = ?, status = 'Assigned'
      WHERE id = ?
    `;

    db.query(updateComplaintQuery, [personnelId, id], (err2, result2) => {
      if (err2) {
        console.error('Error updating complaint:', err2);
        return res.status(500).json({
          success: false,
          message: 'Failed to assign personnel to complaint',
        });
      }

      // Third, mark the personnel as unavailable
      const updatePersonnelQuery = `
        UPDATE personnel
        SET available = 0
        WHERE id = ?
      `;

      db.query(updatePersonnelQuery, [personnelId], (err3, result3) => {
        if (err3) {
          console.error('Error updating personnel availability:', err3);
          return res.status(500).json({
            success: false,
            message: 'Complaint updated, but failed to update personnel availability',
          });
        }

        res.json({
          success: true,
          message: 'Personnel assigned successfully',
        });
      });
    });
  });
};

exports.getUserComplaints = (req, res) => {
  const { email } = req.params;
  const sql = "SELECT * FROM complaints WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    return res.json({ success: true, complaints: results });
  });
};


exports.resolvedComplaint = (req, res) => {
  const { id } = req.params;

  // First, get the assigned personnel id
  const getPersonnelQuery = "SELECT assigned_personnel_id FROM complaints WHERE id = ?";
  db.query(getPersonnelQuery, [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(500).json({ success: false, message: "Error finding complaint" });
    }

    const personnelId = results[0].assigned_personnel_id;

    // Update the complaint status to "Resolved"
    const updateComplaintQuery = "UPDATE complaints SET status = 'Resolved' WHERE id = ?";
    db.query(updateComplaintQuery, [id], (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error updating complaint" });
      }

      // Set personnel availability if assigned
      if (personnelId) {
        const updatePersonnelQuery = "UPDATE personnel SET available = 1 WHERE id = ?";
        db.query(updatePersonnelQuery, [personnelId], (err) => {
          if (err) {
            console.error("Failed to update personnel availability", err);
            return res.status(500).json({ success: false, message: "Error updating personnel availability" });
          }

          return res.json({ success: true, message: "Complaint marked as resolved and personnel available" });
        });
      } else {
        return res.json({ success: true, message: "Complaint marked as resolved" });
      }
    });
  });
};



exports.trackTicket = (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: "Email and ticket code are required" });
  }

  const sql = `
    SELECT c.status, 
           p.name AS personnel_name, 
           p.contact AS personnel_contact 
    FROM complaints c 
    LEFT JOIN personnel p ON c.assigned_personnel_id = p.id 
    WHERE c.email = ? AND c.code = ?
  `;

  db.query(sql, [email, code], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "Ticket not found" });
    }

    const { status, personnel_name, personnel_contact } = results[0];
    const response = { success: true, status };

    if (status === 'Assigned') {
      response.personnel = {
        name: personnel_name,
        contact: personnel_contact,
      };
    }

    return res.json(response);
  });
};
