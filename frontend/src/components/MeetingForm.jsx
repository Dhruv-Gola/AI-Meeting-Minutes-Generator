import { useRef, useState } from "react";
import { createMeeting } from "../services/api";

function MeetingForm({ onMeetingCreated, onCancel }) {
    const [title, setTitle] = useState("");
    const [meetingDate, setMeetingDate] = useState("");
    const [participants, setParticipants] = useState("");
    const [transcript, setTranscript] = useState("");

    const [transcriptMode, setTranscriptMode] = useState("paste");
    const [selectedFile, setSelectedFile] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setError("");

        if (file.size > 5 * 1024 * 1024) {
            setError("Transcript file must be smaller than 5 MB.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = (loadEvent) => {
            const fileText = loadEvent.target?.result;

            if (typeof fileText !== "string") {
                setError("Unable to read the transcript file.");
                return;
            }

            setTranscript(fileText);
            setSelectedFile(file.name);
        };

        reader.onerror = () => {
            setError("Unable to read the transcript file.");
        };

        reader.readAsText(file);
    };

    const handleModeChange = (mode) => {
        setTranscriptMode(mode);
        setError("");

        if (mode === "paste") {
            setSelectedFile("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!title.trim() || !meetingDate) {
            setError("Title and meeting date are required.");
            return;
        }

        if (!transcript.trim()) {
            setError("Please paste or upload a meeting transcript.");
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
                setError(
                    result.message || "Failed to create meeting."
                );
                return;
            }

            setTitle("");
            setMeetingDate("");
            setParticipants("");
            setTranscript("");
            setSelectedFile("");
            setTranscriptMode("paste");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

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

                <div className="transcript-input">
                    <label>
                        Transcript Input
                    </label>

                    <div className="transcript-mode-buttons">
                        <button
                            type="button"
                            className={`transcript-mode-button ${
                                transcriptMode === "paste"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleModeChange("paste")
                            }
                            disabled={loading}
                        >
                            Paste Transcript
                        </button>

                        <button
                            type="button"
                            className={`transcript-mode-button ${
                                transcriptMode === "upload"
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() =>
                                handleModeChange("upload")
                            }
                            disabled={loading}
                        >
                            Upload Transcript
                        </button>
                    </div>

                    {transcriptMode === "paste" ? (
                        <textarea
                            id="meeting-transcript"
                            value={transcript}
                            onChange={(event) =>
                                setTranscript(
                                    event.target.value
                                )
                            }
                            placeholder="Paste your meeting transcript here..."
                            rows="10"
                            disabled={loading}
                        />
                    ) : (
    <div className="transcript-upload-box">
        <p className="transcript-upload-text">
            Upload a transcript file to automatically load its contents.
        </p>

        <input
            ref={fileInputRef}
            id="meeting-transcript-file"
            className="hidden-file-input"
            type="file"
            accept=".txt,.md,.vtt,.srt,text/plain"
            onChange={handleFileChange}
            disabled={loading}
        />

        <button
            type="button"
            className="choose-file-button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
        >
            {selectedFile
                ? "Change Transcript File"
                : "Choose Transcript File"}
        </button>

        {selectedFile && (
            <p className="selected-file">
                📄
                <span>
                    Selected file: <strong>{selectedFile}</strong>
                </span>
            </p>
        )}

        {transcript && (
            <textarea
                value={transcript}
                readOnly
                rows="10"
                disabled={loading}
            />
        )}
    </div>
)}
                        
                    

    <small className="transcript-help">
    Supported files: TXT, MD, VTT, SRT · Maximum size: 5 MB
</small>
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
