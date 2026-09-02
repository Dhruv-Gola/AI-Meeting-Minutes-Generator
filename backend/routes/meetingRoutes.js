const express = require("express");

const {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
} = require("../controllers/meetingController");

const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// All meeting routes require authentication
router.use(authenticateToken);

// Create a meeting
router.post("/", createMeeting);

// Get all meetings
router.get("/", getAllMeetings);

// Get a meeting by ID
router.get("/:id", getMeetingById);

// Update a meeting
router.put("/:id", updateMeeting);

// Delete a meeting
router.delete("/:id", deleteMeeting);

module.exports = router;
