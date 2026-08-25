import { useState } from "react";
import MeetingList from "./components/MeetingList";
import MeetingForm from "./components/MeetingForm";
import MeetingDetails from "./components/MeetingDetails";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);

  const handleCreateMeeting = () => {
    setCurrentPage("create");
  };

  const handleViewMeeting = (meetingId) => {
    setSelectedMeetingId(meetingId);
    setCurrentPage("details");
  };

  const handleMeetingCreated = (meeting) => {
    setSelectedMeetingId(meeting.meeting_id);
    setCurrentPage("details");
  };

  const handleBackToHome = () => {
    setSelectedMeetingId(null);
    setCurrentPage("home");
  };

  return (
    <div className="app">
      <header className="navbar">
        <div className="container navbar-content">
          <div
            className="brand"
            onClick={handleBackToHome}
            style={{ cursor: "pointer" }}
          >
            <div className="brand-icon">M</div>
            <span>AI Minutes</span>
          </div>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
          </nav>

          <button
            className="nav-button"
            onClick={handleCreateMeeting}
          >
            Get Started
          </button>
        </div>
      </header>

      <main>
        {currentPage === "home" && (
          <>
            <section className="hero">
              <div className="container hero-content">
                <div className="hero-text">
                  <div className="badge">
                    ✦ AI-powered meeting assistant
                  </div>

                  <h1>
                    Turn meetings into
                    <span> clear, actionable minutes.</span>
                  </h1>

                  <p>
                    Transform meeting transcripts into structured
                    summaries, action items, decisions, risks, and
                    open questions in seconds.
                  </p>

                  <div className="hero-actions">
                    <button
                      className="primary-button"
                      onClick={handleCreateMeeting}
                    >
                      Create New Meeting
                      <span>→</span>
                    </button>

                    <button
                      className="secondary-button"
                      onClick={() => {
                        document
                          .getElementById("meetings")
                          ?.scrollIntoView({
                            behavior: "smooth"
                          });
                      }}
                    >
                      View Dashboard
                    </button>
                  </div>
                </div>

                <div className="hero-card">
                  <div className="card-header">
                    <div>
                      <p className="card-label">
                        AI Meeting Summary
                      </p>

                      <h3>Project Kickoff</h3>
                    </div>

                    <div className="status">
                      Generated
                    </div>
                  </div>

                  <div className="summary-section">
                    <p className="section-label">
                      SUMMARY
                    </p>

                    <p>
                      The team discussed the project scope,
                      timeline, responsibilities, and upcoming
                      development steps.
                    </p>
                  </div>

                  <div className="mini-grid">
                    <div>
                      <p className="section-label">
                        ACTION ITEMS
                      </p>

                      <strong>3 items</strong>
                    </div>

                    <div>
                      <p className="section-label">
                        DECISIONS
                      </p>

                      <strong>2 decisions</strong>
                    </div>

                    <div>
                      <p className="section-label">
                        RISKS
                      </p>

                      <strong>1 identified</strong>
                    </div>

                    <div>
                      <p className="section-label">
                        QUESTIONS
                      </p>

                      <strong>2 open</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="features"
              id="features"
            >
              <div className="container">
                <div className="section-heading">
                  <p className="eyebrow">
                    BUILT FOR PRODUCTIVE TEAMS
                  </p>

                  <h2>
                    Everything important from your meeting.
                  </h2>

                  <p>
                    Let AI handle the note-taking so you can
                    focus on the conversation.
                  </p>
                </div>

                <div className="feature-grid">
                  <div className="feature-card">
                    <div className="feature-icon">
                      ✦
                    </div>

                    <h3>AI Summary</h3>

                    <p>
                      Get a concise overview of the most
                      important points discussed during the
                      meeting.
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      ✓
                    </div>

                    <h3>Action Items</h3>

                    <p>
                      Automatically identify tasks and
                      responsibilities assigned during the
                      meeting.
                    </p>
                  </div>

                  <div className="feature-card">
                    <div className="feature-icon">
                      ◆
                    </div>

                    <h3>Decisions & Risks</h3>

                    <p>
                      Keep track of important decisions,
                      potential risks, and unresolved
                      questions.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="how-it-works"
              id="how-it-works"
            >
              <div className="container">
                <div className="section-heading">
                  <p className="eyebrow">
                    HOW IT WORKS
                  </p>

                  <h2>
                    From transcript to minutes in three
                    steps.
                  </h2>
                </div>

                <div className="steps">
                  <div className="step">
                    <span>01</span>

                    <h3>Add your meeting</h3>

                    <p>
                      Enter your meeting details and paste
                      or upload the transcript.
                    </p>
                  </div>

                  <div className="step">
                    <span>02</span>

                    <h3>Generate with AI</h3>

                    <p>
                      Our AI analyzes the transcript and
                      identifies the important information.
                    </p>
                  </div>

                  <div className="step">
                    <span>03</span>

                    <h3>Review & export</h3>

                    <p>
                      Review your minutes and export them
                      when you're ready.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="meetings">
              <MeetingList
                onMeetingSelect={handleViewMeeting}
              />
            </section>
          </>
        )}

        {currentPage === "create" && (
          <div className="container">
            <MeetingForm
              onMeetingCreated={handleMeetingCreated}
              onCancel={handleBackToHome}
            />
          </div>
        )}

        {currentPage === "details" &&
          selectedMeetingId && (
            <div className="container">
              <MeetingDetails
                meetingId={selectedMeetingId}
                onBack={handleBackToHome}
              />
            </div>
          )}
      </main>

      <footer>
        <div className="container footer-content">
          <span>AI Minutes</span>
          <span>
            AI Meeting Minutes Generator
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;