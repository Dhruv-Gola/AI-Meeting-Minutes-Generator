import { useState } from "react";
import { createMeeting } from "../services/api";

function MeetingForm({ onMeetingCreated, onCancel }) {
    const [title, setTitle] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [participants, setParticipants] = useState("");
    const [transcript, setTranscript] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!title.trim() || !meetingDate) {
            setError("Title and meeting date are required.");
            return;
        }

        try {
            setLoading(true);

            const result = await createMeeting({
                title: title.trim(),
                meetingDate,
                participants: participants.trim(),
                transcript: transcript.trim()
            });

            if (!result.success) {
                setError(result.message || "Failed to create meeting.");
                return;
            }

            setTitle("");
            setMeetingDate("");
            setParticipants("");
            setTranscript("");

            if (onMeetingCreated) {
                onMeetingCreated(result.data);
            }
        } catch (err) {
            console.error("Create meeting error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to create meeting. Please check the backend."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="meeting-form">
            <div className="meeting-form-header">
                <h2>Create New Meeting</h2>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="meeting-title">
                        Meeting Title
                    </label>

                    <input
                        id="meeting-title"
                        type="text"
                        value={title}
                        onChange={(event) =>
                            setTitle(event.target.value)
                        }
                        placeholder="Enter meeting title"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="meeting-date">
                        Meeting Date
                    </label>

                    <input
                        id="meeting-date"
                        type="datetime-local"
                        value={meetingDate}
                        onChange={(event) =>
                            setMeetingDate(event.target.value)
                        }
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="meeting-participants">
                        Participants
                    </label>

                    <input
                        id="meeting-participants"
                        type="text"
                        value={participants}
                        onChange={(event) =>
                            setParticipants(event.target.value)
                        }
                        placeholder="e.g. Dhruv, Alex, Sarah"
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="meeting-transcript">
                        Transcript
                    </label>

                    <textarea
                        id="meeting-transcript"
                        value={transcript}
                        onChange={(event) =>
                            setTranscript(event.target.value)
                        }
                        placeholder="Paste the meeting transcript here..."
                        rows="10"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <p className="form-error">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating Meeting..."
                        : "Create Meeting"}
                </button>
            </form>
        </section>
    );
}

export default MeetingForm;