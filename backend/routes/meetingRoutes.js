const express = require("express");

const {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
} = require("../controllers/meetingController");

const router = express.Router();

// Create a meeting
router.post("/", createMeeting);

// Get all meetings
router.get("/", getAllMeetings);

// Get a meeting by ID
router.get("/:id", getMeetingById);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

module.exports = router;