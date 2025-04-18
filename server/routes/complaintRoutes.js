const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
// const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/complaints",  upload.array("attachments"), complaintController.submitComplaint);
router.get("/complaints",  complaintController.getAllComplaints);
router.post("/complaints/track", complaintController.trackTicket);
router.patch("/complaints/:id",  complaintController.resolvedComplaint);
router.put("/complaints/:id/assign",  complaintController.assignPersonnel);
router.get("/complaints/user/:email", complaintController.getUserComplaints);

module.exports = router;
