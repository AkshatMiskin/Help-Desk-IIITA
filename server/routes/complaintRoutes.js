const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const verifyToken = require("../middleware/auth");

router.post("/complaints", complaintController.submitComplaint);
router.get("/complaints", complaintController.getAllComplaints);
router.delete("/complaints/:id", complaintController.deleteComplaint);
router.put("/complaints/:id/assign", complaintController.assignPersonnel);
router.get("/complaints/user/:email", complaintController.getComplaintsByUser);

module.exports = router;
