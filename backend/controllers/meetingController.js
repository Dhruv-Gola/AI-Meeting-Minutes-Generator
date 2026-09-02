const meetingService = require("../services/meetingService");


const createMeeting = async (req, res) => {
    try {
        const { title, meetingDate, participants, transcript } = req.body;
        const userId = req.user.user_id;

        if (!title || !meetingDate) {
            return res.status(400).json({
                success: false,
                message: "Title and meeting date are required"
            });
        }

        const meeting = await meetingService.createMeeting(
            userId,
            title,
            meetingDate,
            participants,
            transcript
        );

        res.status(201).json({
            success: true,
            message: "Meeting created successfully",
            data: meeting
        });

    } catch (error) {
        console.error("Create meeting error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create meeting"
        });
    }
};


const getAllMeetings = async (req, res) => {
    try {
        console.log("GET /api/meetings - fetching meetings...");

        const userId = req.user.user_id;

        const meetings = await meetingService.getAllMeetings(userId);

        console.log("Meetings fetched successfully:", meetings);

        res.status(200).json({
            success: true,
            data: meetings
        });

    } catch (error) {
        console.error("GET MEETINGS ERROR:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch meetings",
            error: error.message
        });
    }
};


const getMeetingById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.user_id;

        const meeting = await meetingService.getMeetingById(id, userId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            data: meeting
        });

    } catch (error) {
        console.error("Get meeting error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch meeting"
        });
    }
};


const updateMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, meetingDate, participants, transcript } = req.body;
        const userId = req.user.user_id;

        if (!title || !meetingDate) {
            return res.status(400).json({
                success: false,
                message: "Title and meeting date are required"
            });
        }

        const meeting = await meetingService.updateMeeting(
            id,
            userId,
            title,
            meetingDate,
            participants,
            transcript
        );

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting updated successfully",
            data: meeting
        });

    } catch (error) {
        console.error("Update meeting error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update meeting"
        });
    }
};


const deleteMeeting = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.user_id;

        const meeting = await meetingService.deleteMeeting(id, userId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting deleted successfully",
            data: meeting
        });

    } catch (error) {
        console.error("Delete meeting error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete meeting"
        });
    }
};


module.exports = {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
};
