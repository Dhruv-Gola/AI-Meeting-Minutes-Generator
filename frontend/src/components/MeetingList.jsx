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
                setLoading(true);
                setError("");

                const result = searchQuery.trim()
                    ? await searchMeetings(searchQuery)
                    : await getMeetings();

                if (result.success) {
                    setMeetings(result.data || []);
                } else {
                    setError("Failed to load meetings");
                }
            } catch (err) {
                console.error("Failed to load meetings:", err);
                setError("Unable to connect to the backend");
            } finally {
                setLoading(false);
            }
        };

        loadMeetings();
    }, [refreshKey, searchQuery]);

    const getMeetingType = (title = "") => {
        const text = title.toLowerCase();

        if (
            text.includes("database") ||
            text.includes("jwt") ||
            text.includes("api") ||
            text.includes("backend")
        ) {
            return "Technical";
        }

        if (
            text.includes("frontend") ||
            text.includes("ui") ||
            text.includes("design")
        ) {
            return "Frontend";
        }

        if (
            text.includes("review") ||
            text.includes("progress")
        ) {
            return "Review";
        }

        if (
            text.includes("product") ||
            text.includes("project")
        ) {
            return "Project";
        }

        return "Project";
    };

    const getIconType = (type) => {
        if (type === "Technical") return "code";
        if (type === "Frontend") return "home";
        if (type === "Review") return "edit";
        return "document";
    };

    const Icon = ({ type }) => {
        if (type === "code") {
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8 9l-4 3 4 3" />
                    <path d="M16 9l4 3-4 3" />
                    <path d="M14 5l-4 14" />
                </svg>
            );
        }

        if (type === "home") {
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M3 11.5L12 4l9 7.5" />
                    <path d="M5.5 10.5V20h13v-9.5" />
                    <path d="M9 20v-5h6v5" />
                </svg>
            );
        }

        if (type === "edit") {
            return (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 20h4L19 9l-4-4L4 16v4z" />
                    <path d="M13.5 6.5l4 4" />
                </svg>
            );
        }

        return (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M8 8h8" />
                <path d="M8 12h8" />
                <path d="M8 16h5" />
            </svg>
        );
    };

    return (
        <section className="meeting-list">
            <div className="meeting-list-header">
                <div className="meeting-list-title">
                    <div className="meeting-section-icon">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M7 3v4" />
                            <path d="M17 3v4" />
                            <path d="M3 10h18" />
                            <path d="M8 14h2" />
                            <path d="M12 14h2" />
                            <path d="M16 14h1" />
                            <path d="M8 18h2" />
                            <path d="M12 18h2" />
                        </svg>
                    </div>

                    <div>
                        <h2>Recent Meetings</h2>
                        <p>View and manage your previous meetings</p>
                    </div>
                </div>

                <div className="meeting-list-actions">
                    <div className="meeting-search">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="11" cy="11" r="6.5" />
                            <path d="M16 16l5 5" />
                        </svg>

                        <input
                            type="text"
                            placeholder="Search meetings..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(event.target.value)
                            }
                        />
                    </div>

                    <div className="meeting-count">
                        {meetings.length} meetings
                    </div>
                </div>
            </div>

            {loading && (
                <div className="meeting-status">
                    Loading meetings...
                </div>
            )}

            {error && (
                <div className="meeting-status meeting-status-error">
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                meetings.length === 0 && (
                    <div className="meeting-status">
                        No meetings found.
                    </div>
                )}

            {!loading &&
                !error &&
                meetings.length > 0 && (
                    <div className="meetings">
                        {meetings.map((meeting, index) => {
                            const type = getMeetingType(meeting.title);
                            const iconType = getIconType(type);

                            return (
                                <article
                                    className={`meeting-card meeting-card-${index % 6}`}
                                    key={meeting.meeting_id}
                                    onClick={() =>
                                        onSelectMeeting?.(meeting)
                                    }
                                >
                                    <div className="meeting-card-main">
                                        <div className="meeting-card-top">
                                            <div className="meeting-card-icon">
                                                <Icon type={iconType} />
                                            </div>

                                            <div className="meeting-card-arrow">
                                                →
                                            </div>
                                        </div>

                                        <h3>{meeting.title}</h3>

                                        <span className="meeting-type">
                                            {type}
                                        </span>

                                        <div className="meeting-meta">
                                            <div>
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <rect
                                                        x="3"
                                                        y="5"
                                                        width="18"
                                                        height="16"
                                                        rx="2"
                                                    />
                                                    <path d="M7 3v4" />
                                                    <path d="M17 3v4" />
                                                    <path d="M3 10h18" />
                                                </svg>

                                                <span>
                                                    {meeting.meeting_date
                                                        ? new Date(
                                                              meeting.meeting_date
                                                          ).toLocaleDateString(
                                                              "en-GB"
                                                          )
                                                        : "No date"}
                                                </span>
                                            </div>

                                            <div>
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <circle
                                                        cx="9"
                                                        cy="8"
                                                        r="3"
                                                    />
                                                    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                                                    <path d="M16 5.5a3 3 0 0 1 0 5" />
                                                    <path d="M18 14c1.8.8 3 2.7 3 5" />
                                                </svg>

                                                <span>
                                                    {meeting.participants ||
                                                        "No participants listed"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="meeting-card-footer">
                                        <span>View meeting</span>
                                        <span className="footer-arrow">
                                            →
                                        </span>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
        </section>
    );
}

export default MeetingList;