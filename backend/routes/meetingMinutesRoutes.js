const express = require("express");
const router = express.Router();

const {
    createMeetingMinutes,
    getMeetingMinutes,
    updateMeetingMinutes,
    deleteMeetingMinutes,
    generateMeetingMinutes
} = require("../controllers/meetingMinutesController");

// Create meeting minutes
router.post("/:meetingId/minutes", createMeetingMinutes);

// Get meeting minutes
router.get("/:meetingId/minutes", getMeetingMinutes);

// Update meeting minutes
router.put("/:meetingId/minutes", updateMeetingMinutes);

// Delete meeting minutes
router.delete("/:meetingId/minutes", deleteMeetingMinutes);

// Generate meeting minutes using AI
router.post("/:meetingId/generate", generateMeetingMinutes);

module.exports = router;