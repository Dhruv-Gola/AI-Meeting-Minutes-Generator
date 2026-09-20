import { useEffect, useState } from "react";
import { getMeetings, searchMeetings } from "../services/api";

function MeetingList({ onSelectMeeting, refreshKey }) {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const loadMeetings = async () => {
            try {
                const result = searchQuery.trim()
                   ? await searchMeetings(searchQuery)
                   : await getMeetings();

                if (result.success) {
                    setMeetings(result.data);
                } else {
                    setError("Failed to load meetings");
                }
            } catch (err) {
                console.error(
                    "Failed to load meetings:",
                    err
                );

                setError(
                    "Unable to connect to the backend"
                );
            } finally {
                setLoading(false);
            }
        };

        loadMeetings();
    }, [refreshKey, searchQuery]);

    return (
        <section className="meeting-list">
            <div className="container">
                <h2>Recent Meetings</h2>

                <input
                   type="text"
                   placeholder="Search meetings..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading && (
                    <p>Loading meetings...</p>
                )}

                {error && (
                    <p>{error}</p>
                )}

                {!loading &&
                    !error &&
                    meetings.length === 0 && (
                        <p>No meetings found.</p>
                    )}

                {!loading &&
                    !error &&
                    meetings.length > 0 && (
                        <div className="meetings">
                            {meetings.map((meeting) => (
                                <div
                                    className="meeting-card"
                                    key={meeting.meeting_id}
                                    onClick={() =>
                                        onSelectMeeting?.(meeting)
                                    }
                                    style={{
                                        cursor: "pointer"
                                    }}
                                >
                                    <h3>
                                        {meeting.title}
                                    </h3>

                                    <p>
                                        {meeting.meeting_date
                                            ? new Date(
                                                  meeting.meeting_date
                                              ).toLocaleDateString()
                                            : "No date"}
                                    </p>

                                    <p>
                                        {meeting.participants ||
                                            "No participants listed"}
                                    </p>

                                    <span>
                                        View meeting →
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
            </div>
        </section>
    );
}

export default MeetingList;