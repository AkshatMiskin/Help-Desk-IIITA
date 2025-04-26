const express = require("express");
const router = express.Router();
const {
  submitComplaint,
  getAllComplaints,
  getUserComplaints,
  assign,
  resolvedComplaint,
  track,
  complaintTypes
} = require("../controllers/complaintController");
const upload = require("../middleware/upload");

router.post("/complaints", upload.array("attachments"), submitComplaint);
router.get("/complaints", getAllComplaints);
router.post("/complaints/track", track);
router.patch("/complaints/:id", resolvedComplaint);
router.put("/complaints/:id/assign", assign);
router.get("/complaints/user/:email", getUserComplaints);
router.get("/complaint_types", complaintTypes);

module.exports = router;
