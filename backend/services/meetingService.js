const pool = require("../config/db");

const createMeeting = async (
    userId,
    title,
    meetingDate,
    participants,
    transcript
) => {
    const result = await pool.query(
        `INSERT INTO meetings
        (user_id, title, meeting_date, participants, transcript)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [userId, title, meetingDate, participants, transcript]
    );

    return result.rows[0];
};

const getAllMeetings = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM meetings
         WHERE user_id = $1
         ORDER BY meeting_date DESC, meeting_id DESC`,
        [userId]
    );

    return result.rows;
};

const getMeetingById = async (meetingId, userId) => {
    const result = await pool.query(
        `SELECT * FROM meetings
         WHERE meeting_id = $1
         AND user_id = $2`,
        [meetingId, userId]
    );

    return result.rows[0];
};

const updateMeeting = async (
    meetingId,
    userId,
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
         AND user_id = $6
         RETURNING *`,
        [
            title,
            meetingDate,
            participants,
            transcript,
            meetingId,
            userId
        ]
    );

    return result.rows[0];
};

const deleteMeeting = async (meetingId, userId) => {
    const result = await pool.query(
        `DELETE FROM meetings
         WHERE meeting_id = $1
         AND user_id = $2
         RETURNING *`,
        [meetingId, userId]
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
