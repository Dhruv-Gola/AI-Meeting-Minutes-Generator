const express = require("express");
const pool = require("../config/db");
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

// Search meetings

router.get("/search", async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || !q.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const result = await pool.query(
            `SELECT *
             FROM meetings
             WHERE user_id = $1
             AND (
                 title ILIKE $2
                 OR participants ILIKE $2
                 OR transcript ILIKE $2
             )
             ORDER BY meeting_date DESC`,
            [req.user.user_id, `%${q.trim()}%`]
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error("Search meetings error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to search meetings"
        });
    }
});

// Get a meeting by ID
router.get("/:id", getMeetingById);

// Update a meeting
router.put("/:id", updateMeeting);

// Delete a meeting
router.delete("/:id", deleteMeeting);

module.exports = router;
