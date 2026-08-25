const pool = require("../config/db");

const createMeetingMinutes = async (
    meetingId,
    summary,
    actionItems,
    decisions,
    risks,
    openQuestions
) => {
    const result = await pool.query(
        `INSERT INTO meeting_minutes
        (meeting_id, summary, action_items, decisions, risks, open_questions)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (meeting_id)
        DO UPDATE SET
            summary = EXCLUDED.summary,
            action_items = EXCLUDED.action_items,
            decisions = EXCLUDED.decisions,
            risks = EXCLUDED.risks,
            open_questions = EXCLUDED.open_questions
        RETURNING *`,
        [
            meetingId,
            summary,
            actionItems,
            decisions,
            risks,
            openQuestions
        ]
    );

    return result.rows[0];
};

const getMeetingMinutes = async (meetingId) => {
    const result = await pool.query(
        `SELECT *
         FROM meeting_minutes
         WHERE meeting_id = $1`,
        [meetingId]
    );

    return result.rows[0];
};

const updateMeetingMinutes = async (
    meetingId,
    summary,
    actionItems,
    decisions,
    risks,
    openQuestions
) => {
    const result = await pool.query(
        `UPDATE meeting_minutes
         SET summary = $1,
             action_items = $2,
             decisions = $3,
             risks = $4,
             open_questions = $5
         WHERE meeting_id = $6
         RETURNING *`,
        [
            summary,
            actionItems,
            decisions,
            risks,
            openQuestions,
            meetingId
        ]
    );

    return result.rows[0];
};

const deleteMeetingMinutes = async (meetingId) => {
    const result = await pool.query(
        `DELETE FROM meeting_minutes
         WHERE meeting_id = $1
         RETURNING *`,
        [meetingId]
    );

    return result.rows[0];
};

module.exports = {
    createMeetingMinutes,
    getMeetingMinutes,
    updateMeetingMinutes,
    deleteMeetingMinutes
};