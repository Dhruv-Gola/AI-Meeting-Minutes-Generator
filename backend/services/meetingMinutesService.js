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

const createActionItems = async (meetingId, actionItemsText) => {
    if (!actionItemsText || !actionItemsText.trim()) {
        return [];
    }

    const actionItems = actionItemsText
        .split(/\n|(?=\d+\.\s)|(?=[A-Z][a-z]+(?:\s+(?:will|to|should)|:))/)
        .map(item => item.replace(/^\d+\.\s*/, "").trim())
        .filter(Boolean)
        .filter(item => item.toLowerCase() !== "none identified");

    const createdItems = [];

    for (const item of actionItems) {
        let assignee = null;
        let description = item;

        // Format: "Alex: Prepare the frontend changes."
        if (item.includes(":")) {
            const parts = item.split(":");
            assignee = parts[0].trim();
            description = parts.slice(1).join(":").trim();
        }

        // Format: "Alex will prepare the frontend changes."
        else {
            const match = item.match(
                /^([A-Z][a-z]+)\s+(?:will|to|should)\s+(.+)$/i
            );

            if (match) {
                assignee = match[1].trim();
                description = match[2].trim();

                if (description) {
                    description =
                        description.charAt(0).toUpperCase() +
                        description.slice(1);
                }
            }
        }

        const result = await pool.query(
            `INSERT INTO action_items
            (meeting_id, assignee, description, due_date, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [meetingId, assignee, description, null, "Pending"]
        );

        createdItems.push(result.rows[0]);
    }

    return createdItems;
};

const deleteActionItems = async (meetingId) => {
    await pool.query(
        `DELETE FROM action_items
         WHERE meeting_id = $1`,
        [meetingId]
    );
};

const getActionItems = async (meetingId) => {
    const result = await pool.query(
        `SELECT *
         FROM action_items
         WHERE meeting_id = $1
         ORDER BY created_at ASC`,
        [meetingId]
    );

    return result.rows;
};

module.exports = {
    createMeetingMinutes,
    getMeetingMinutes,
    updateMeetingMinutes,
    deleteMeetingMinutes,
    deleteActionItems,
    createActionItems,
    getActionItems
};
