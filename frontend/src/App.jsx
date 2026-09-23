import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import MeetingList from "./components/MeetingList";
import MeetingForm from "./components/MeetingForm";
import MeetingDetails from "./components/MeetingDetails";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [showRegister, setShowRegister] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [meetingListKey, setMeetingListKey] = useState(0);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setSelectedMeeting(null);
  };

  if (!user) {
    if (showRegister) {
      return (
        <Register
          onRegisterSuccess={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setShowRegister(true)}
      />
    );
  }

  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-left">
          <div className="app-logo" aria-label="AI">
            AI
          </div>

          <h1>AI Meeting Minutes Generator</h1>
        </div>

        <div className="app-header-right">
          <div className="user-welcome">
            <div className="user-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="3.2" />
                <path d="M5.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
              </svg>
            </div>

            <span className="welcome-label">Welcome,</span>
            <strong>{user.name}</strong>
            <span className="user-arrow" aria-hidden="true">⌄</span>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10 5H5v14h5" />
              <path d="M14 8l4 4-4 4" />
              <path d="M18 12H9" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="app-content">
        {selectedMeeting ? (
          <MeetingDetails
            meetingId={selectedMeeting.meeting_id}
            onBack={() => setSelectedMeeting(null)}
          />
        ) : (
          <>
            <MeetingForm
              onMeetingCreated={() =>
                setMeetingListKey((key) => key + 1)
              }
            />

            <MeetingList
              refreshKey={meetingListKey}
              onSelectMeeting={(meeting) =>
                setSelectedMeeting(meeting)
              }
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
