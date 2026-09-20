import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
    getMeeting,
    getMeetingMinutes,
    getMeetingActionItems,
    generateMinutes,
    updateMeetingMinutes,
    deleteMeetingMinutes
} from "../services/api";

function MeetingDetails({ meetingId, onBack }) {
    const [meeting, setMeeting] = useState(null);
    const [minutes, setMinutes] = useState(null);
    const [meetingActionItems, setMeetingActionItems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [editing, setEditing] = useState(false);

    const [summary, setSummary] = useState("");
    const [actionItems, setActionItems] = useState("");
    const [decisions, setDecisions] = useState("");
    const [risks, setRisks] = useState("");
    const [openQuestions, setOpenQuestions] = useState("");

    const [error, setError] = useState("");

    

    useEffect(() => {
    if (!meetingId) {
        return;
    }

    let cancelled = false;

    const fetchMeeting = async () => {
        try {
            setLoading(true);
            setError("");

            const meetingResult = await getMeeting(meetingId);

            if (!meetingResult.success) {
                throw new Error(
                    meetingResult.message ||
                    "Failed to load meeting"
                );
            }

            if (cancelled) {
                return;
            }

            setMeeting(meetingResult.data);

            try {
                const minutesResult =
                    await getMeetingMinutes(meetingId);

                if (cancelled) {
                    return;
                }

                if (minutesResult.success) {
                    setMinutes(minutesResult.data);
                } else {
                    setMinutes(null);
                }
            } catch {
                if (!cancelled) {
                    console.log(
                        "No meeting minutes found yet."
                    );
                    setMinutes(null);
                }
            }
            const actionItemsResult =
                await getMeetingActionItems(meetingId);

            if (actionItemsResult.success) {
                setMeetingActionItems(actionItemsResult.data || []);
            }            


        } catch (err) {
            if (!cancelled) {
                console.error(
                    "Load meeting error:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load meeting."
                );
            }
        } finally {
            if (!cancelled) {
                setLoading(false);
            }
        }
    };

    fetchMeeting();

    return () => {
        cancelled = true;
    };
}, [meetingId]);

    const populateEditFields = () => {
        if (!minutes) {
            return;
        }

        setSummary(minutes.summary || "");

        setActionItems(
            minutes.action_items ||
            minutes.actionItems ||
            ""
        );

        setDecisions(minutes.decisions || "");

        setRisks(minutes.risks || "");

        setOpenQuestions(
            minutes.open_questions ||
            minutes.openQuestions ||
            ""
        );
    };

    const handleEdit = () => {
        populateEditFields();
        setError("");
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setError("");
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError("");

            const result = await updateMeetingMinutes(
                meetingId,
                {
                    summary: summary.trim(),
                    actionItems: actionItems.trim(),
                    decisions: decisions.trim(),
                    risks: risks.trim(),
                    openQuestions: openQuestions.trim()
                }
            );

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Failed to update meeting minutes"
                );
            }

            setMinutes(result.data);
            setEditing(false);

        } catch (err) {
            console.error("Update minutes error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to update meeting minutes."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete these meeting minutes?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const result =
                await deleteMeetingMinutes(meetingId);

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Failed to delete meeting minutes"
                );
            }

            setMinutes(null);
            setEditing(false);

        } catch (err) {
            console.error("Delete minutes error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to delete meeting minutes."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleExportTXT = () => {
    if (!meeting || !minutes) {
        return;
    }

    const content = `
AI MEETING MINUTES

Title: ${meeting.title}
Date: ${
        meeting.meeting_date
            ? new Date(meeting.meeting_date).toLocaleString()
            : "No date"
    }
Participants: ${
        meeting.participants || "No participants listed"
    }

SUMMARY
${minutes.summary || "None identified"}

ACTION ITEMS
${
    minutes.action_items ||
    minutes.actionItems ||
    "None identified"
}

DECISIONS
${minutes.decisions || "None identified"}

RISKS
${minutes.risks || "None identified"}

OPEN QUESTIONS
${
    minutes.open_questions ||
    minutes.openQuestions ||
    "None identified"
}
`.trim();

    const blob = new Blob([content], {
        type: "text/plain"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${meeting.title || "meeting-minutes"}.txt`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

const handleExportPDF = () => {
    if (!meeting || !minutes) {
        return;
    }

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text("AI Meeting Minutes", 20, y);

    y += 15;
    doc.setFontSize(12);
    doc.text(`Title: ${meeting.title || "No title"}`, 20, y);

    y += 8;
    doc.text(
        `Date: ${
            meeting.meeting_date
                ? new Date(meeting.meeting_date).toLocaleString()
                : "No date"
        }`,
        20,
        y
    );

    y += 8;
    doc.text(
        `Participants: ${meeting.participants || "No participants listed"}`,
        20,
        y
    );

    y += 15;

    doc.setFontSize(14);
    doc.text("Summary", 20, y);

    y += 8;
    doc.setFontSize(12);

    const summary = doc.splitTextToSize(
        minutes.summary || "None identified",
        170
    );

    doc.text(summary, 20, y);
    y += summary.length * 7 + 10;

    doc.setFontSize(14);
    doc.text("Action Items", 20, y);

    y += 8;
    doc.setFontSize(12);

    const actionItems = doc.splitTextToSize(
        minutes.action_items ||
            minutes.actionItems ||
            "None identified",
        170
    );

    doc.text(actionItems, 20, y);
    y += actionItems.length * 7 + 10;

    doc.setFontSize(14);
    doc.text("Decisions", 20, y);

    y += 8;
    doc.setFontSize(12);

    const decisions = doc.splitTextToSize(
        minutes.decisions || "None identified",
        170
    );

    doc.text(decisions, 20, y);
    y += decisions.length * 7 + 10;

    doc.setFontSize(14);
    doc.text("Risks", 20, y);

    y += 8;
    doc.setFontSize(12);

    const risks = doc.splitTextToSize(
        minutes.risks || "None identified",
        170
    );

    doc.text(risks, 20, y);
    y += risks.length * 7 + 10;

    doc.setFontSize(14);
    doc.text("Open Questions", 20, y);

    y += 8;
    doc.setFontSize(12);

    const openQuestions = doc.splitTextToSize(
        minutes.open_questions ||
            minutes.openQuestions ||
            "None identified",
        170
    );

    doc.text(openQuestions, 20, y);

    doc.save(`${meeting.title || "meeting-minutes"}.pdf`);
};
    
    const handleGenerateMinutes = async () => {
        console.log("GENERATE BUTTON CLICKED - meetingId:", meetingId);
        try {
            setGenerating(true);
            setError("");

            const result =
                await generateMinutes(meetingId);

            if (!result.success) {
                throw new Error(
                    result.message ||
                    "Failed to generate meeting minutes"
                );
            }

           setMinutes(result.data);

           const actionItemsResult =
                await getMeetingActionItems(meetingId);

           if (actionItemsResult.success) {
               setMeetingActionItems(
                   actionItemsResult.data || []
               );
            }

           setEditing(false);

        } catch (err) {
            console.error("Generate minutes error:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to generate meeting minutes."
            );
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <section className="meeting-details">
                <p>Loading meeting...</p>
            </section>
        );
    }

    if (error && !meeting) {
        return (
            <section className="meeting-details">
                <button onClick={onBack}>
                    ← Back to meetings
                </button>

                <p className="form-error">
                    {error}
                </p>
            </section>
        );
    }

    if (!meeting) {
        return null;
    }

    return (
        <section className="meeting-details">

            <button
                className="back-button"
                onClick={onBack}
            >
                ← Back to meetings
            </button>

            <div className="meeting-details-header">

                <div>
                    <p className="eyebrow">
                        MEETING
                    </p>

                    <h1>{meeting.title}</h1>

                    <p className="meeting-meta">
                        {meeting.meeting_date
                            ? new Date(
                                  meeting.meeting_date
                              ).toLocaleString()
                            : "No date"}
                    </p>

                    <p className="meeting-meta">
                        {meeting.participants ||
                            "No participants listed"}
                    </p>
                </div>

                <div className="meeting-actions">

                    {minutes && !editing && (
                        <>
                            <button
                                className="secondary-button"
                                onClick={handleEdit}
                                disabled={
                                    generating ||
                                    deleting
                                }
                            >
                                Edit Minutes
                            </button>

                            <button
                                className="secondary-button"
                                onClick={handleDelete}
                                disabled={
                                    generating ||
                                    deleting
                                }
                            >
                                {deleting
                                    ? "Deleting..."
                                    : "Delete Minutes"}
                            </button>
                        </>
                    )}

                    <button
                        className="primary-button"
                        onClick={handleGenerateMinutes}
                        disabled={
                            generating ||
                            saving ||
                            deleting ||
                            editing
                        }
                    >
                        {generating
                            ? "Generating..."
                            : minutes
                            ? "Regenerate Minutes"
                            : "Generate Minutes"}
                    </button>

                    <button onClick={handleExportTXT} disabled={!minutes}>
                        Export TXT
                    </button>

                    <button onClick={handleExportPDF} disabled={!minutes}>
                        Export PDF
                    </button>

                </div>

            </div>

            {error && (
                <p className="form-error">
                    {error}
                </p>
            )}

            {!minutes &&
                !generating && (
                    <div className="empty-minutes">

                        <h2>
                            No meeting minutes yet
                        </h2>

                        <p>
                            Click "Generate Minutes"
                            to analyze this meeting
                            transcript with AI.
                        </p>

                    </div>
                )}

            {minutes && !editing && (
                <div className="minutes-content">

                    <div className="minutes-card">
                        <p className="section-label">
                            SUMMARY
                        </p>

                        <h2>Summary</h2>

                        <p>
                            {minutes.summary ||
                                "No summary available."}
                        </p>
                    </div>

                    <div className="minutes-card">
    <p className="section-label">
        ACTION ITEMS
    </p>

    <h2>Action Items</h2>

    {meetingActionItems.length > 0 ? (
        <table className="action-items-table">
            <thead>
                <tr>
                    <th>Assignee</th>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
                {meetingActionItems.map((item) => (
                    <tr key={item.action_item_id}>
                        <td>{item.assignee || "Unassigned"}</td>
                        <td>{item.description}</td>
                        <td>{item.due_date || "Not set"}</td>
                        <td>
                         <span className="action-status">
                           {item.status || "Pending"}
                         </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p className="minutes-text">
            No action items found.
        </p>
    )}
</div> 

                    <div className="minutes-card">
                        <p className="section-label">
                            DECISIONS
                        </p>

                        <h2>Decisions</h2>

                        <p className="minutes-text">
                            {minutes.decisions ||
                                "None identified"}
                        </p>
                    </div>

                    <div className="minutes-card">
                        <p className="section-label">
                            RISKS
                        </p>

                        <h2>Risks</h2>

                        <p className="minutes-text">
                            {minutes.risks ||
                                "None identified"}
                        </p>
                    </div>

                    <div className="minutes-card">
                        <p className="section-label">
                            OPEN QUESTIONS
                        </p>

                        <h2>Open Questions</h2>

                        <p className="minutes-text">
                            {minutes.open_questions ||
                                minutes.openQuestions ||
                                "None identified"}
                        </p>
                    </div>

                </div>
            )}

            {editing && (
                <div className="minutes-content">

                    <div className="minutes-card">
                        <p className="section-label">
                            EDIT MINUTES
                        </p>

                        <h2>Summary</h2>

                        <textarea
                            value={summary}
                            onChange={(event) =>
                                setSummary(
                                    event.target.value
                                )
                            }
                            rows="6"
                            disabled={saving}
                        />
                    </div>

                    <div className="minutes-card">
                        <h2>Action Items</h2>

                        <textarea
                            value={actionItems}
                            onChange={(event) =>
                                setActionItems(
                                    event.target.value
                                )
                            }
                            rows="6"
                            disabled={saving}
                        />
                    </div>

                    <div className="minutes-card">
                        <h2>Decisions</h2>

                        <textarea
                            value={decisions}
                            onChange={(event) =>
                                setDecisions(
                                    event.target.value
                                )
                            }
                            rows="6"
                            disabled={saving}
                        />
                    </div>

                    <div className="minutes-card">
                        <h2>Risks</h2>

                        <textarea
                            value={risks}
                            onChange={(event) =>
                                setRisks(
                                    event.target.value
                                )
                            }
                            rows="6"
                            disabled={saving}
                        />
                    </div>

                    <div className="minutes-card">
                        <h2>Open Questions</h2>

                        <textarea
                            value={openQuestions}
                            onChange={(event) =>
                                setOpenQuestions(
                                    event.target.value
                                )
                            }
                            rows="6"
                            disabled={saving}
                        />
                    </div>

                    <div className="meeting-actions">

                        <button
                            className="primary-button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                        <button
                            className="secondary-button"
                            onClick={handleCancelEdit}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                    </div>

                </div>
            )}

        </section>
    );
}

export default MeetingDetails;