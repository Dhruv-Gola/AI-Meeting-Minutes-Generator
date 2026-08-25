const meetingMinutesService = require("../services/meetingMinutesService");
const meetingMinutesAIService = require("../services/meetingMinutesAIService");
const meetingService = require("../services/meetingService");

const createMeetingMinutes = async (req, res) => {
    try {
        const { meetingId } = req.params;

        const {
            summary,
            actionItems,
            decisions,
            risks,
            openQuestions
        } = req.body;

        const minutes = await meetingMinutesService.createMeetingMinutes(
            meetingId,
            summary,
            actionItems,
            decisions,
            risks,
            openQuestions
        );

        res.status(201).json({
            success: true,
            message: "Meeting minutes created successfully",
            data: minutes
        });

    } catch (error) {
        console.error("Create meeting minutes error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create meeting minutes"
        });
    }
};

const getMeetingMinutes = async (req, res) => {
    try {
        const { meetingId } = req.params;

        const minutes = await meetingMinutesService.getMeetingMinutes(
            meetingId
        );

        if (!minutes) {
            return res.status(404).json({
                success: false,
                message: "Meeting minutes not found"
            });
        }

        res.status(200).json({
            success: true,
            data: minutes
        });

    } catch (error) {
        console.error("Get meeting minutes error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch meeting minutes"
        });
    }
};

const updateMeetingMinutes = async (req, res) => {
    try {
        const { meetingId } = req.params;

        const {
            summary,
            actionItems,
            decisions,
            risks,
            openQuestions
        } = req.body;

        const minutes = await meetingMinutesService.updateMeetingMinutes(
            meetingId,
            summary,
            actionItems,
            decisions,
            risks,
            openQuestions
        );

        if (!minutes) {
            return res.status(404).json({
                success: false,
                message: "Meeting minutes not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting minutes updated successfully",
            data: minutes
        });

    } catch (error) {
        console.error("Update meeting minutes error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update meeting minutes"
        });
    }
};

const deleteMeetingMinutes = async (req, res) => {
    try {
        const { meetingId } = req.params;

        const minutes = await meetingMinutesService.deleteMeetingMinutes(
            meetingId
        );

        if (!minutes) {
            return res.status(404).json({
                success: false,
                message: "Meeting minutes not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meeting minutes deleted successfully",
            data: minutes
        });

    } catch (error) {
        console.error("Delete meeting minutes error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete meeting minutes"
        });
    }
};

const generateMeetingMinutes = async (req, res) => {
    try {
        const { meetingId } = req.params;

        // Get meeting and transcript
        const meeting = await meetingService.getMeetingById(meetingId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: "Meeting not found"
            });
        }

        if (!meeting.transcript || !meeting.transcript.trim()) {
            return res.status(400).json({
                success: false,
                message: "Meeting transcript is required"
            });
        }

        // Generate minutes using Gemini
        const generatedMinutes =
            await meetingMinutesAIService.generateMeetingMinutes(
                meeting.transcript
            );

        // Save generated minutes
        const minutes =
            await meetingMinutesService.createMeetingMinutes(
                meetingId,
                generatedMinutes.summary,
                generatedMinutes.actionItems,
                generatedMinutes.decisions,
                generatedMinutes.risks,
                generatedMinutes.openQuestions
            );

        res.status(201).json({
            success: true,
            message: "Meeting minutes generated successfully",
            data: minutes
        });

    } catch (error) {
    console.error("Generate meeting minutes error:", error);

    res.status(500).json({
        success: false,
        message: "Failed to generate meeting minutes",
        error: error.message
    });
}
};

module.exports = {
    createMeetingMinutes,
    getMeetingMinutes,
    updateMeetingMinutes,
    deleteMeetingMinutes,
    generateMeetingMinutes
};