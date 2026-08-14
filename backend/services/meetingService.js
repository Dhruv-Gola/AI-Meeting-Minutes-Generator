const pool = require("../config/db");

const createMeeting = async (title, meetingDate, participants, transcript) => {
    const result = await pool.query(
        `INSERT INTO meetings
        (title, meeting_date, participants, transcript)
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [title, meetingDate, participants, transcript]
    );

    return result.rows[0];
};

const getAllMeetings = async () => {
    const result = await pool.query(
        `SELECT * FROM meetings
         ORDER BY meeting_date DESC, meeting_id DESC`
    );

    return result.rows;
};

const getMeetingById = async (meetingId) => {
    const result = await pool.query(
        `SELECT * FROM meetings
         WHERE meeting_id = $1`,
        [meetingId]
    );

    return result.rows[0];
};

// Update a meeting
const updateMeeting = async (
    meetingId,
    title,
    meetingDate,
    participants,
    transcript
) => {
    const result = await pool.query(
        `UPDATE meetings
         SET title = $1,
             meeting_date = $2,
             participants = $3,
             transcript = $4
         WHERE meeting_id = $5
         RETURNING *`,
        [title, meetingDate, participants, transcript, meetingId]
    );

    return result.rows[0];
};

const deleteMeeting = async (meetingId) => {
    const result = await pool.query(
        `DELETE FROM meetings
         WHERE meeting_id = $1
         RETURNING *`,
        [meetingId]
    );

    return result.rows[0];
};

module.exports = {
    createMeeting,
    getAllMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
};