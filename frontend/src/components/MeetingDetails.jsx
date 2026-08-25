import { useEffect, useState } from "react";
import {
    getMeeting,
    getMeetingMinutes,
    generateMinutes,
    updateMeetingMinutes,
    deleteMeetingMinutes
} from "../services/api";

function MeetingDetails({ meetingId, onBack }) {
    const [meeting, setMeeting] = useState(null);
    const [minutes, setMinutes] = useState(null);

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

    const handleGenerateMinutes = async () => {
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

                        <p className="minutes-text">
                            {minutes.action_items ||
                                minutes.actionItems ||
                                "None identified"}
                        </p>
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