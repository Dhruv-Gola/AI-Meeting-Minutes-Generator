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

  // Admin users go to the Admin Portal
  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  // Normal users go to the User Portal
  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>AI Meeting Minutes Generator</h1>
          <p>Welcome, {user.name}</p>
        </div>

        <button onClick={handleLogout}>Logout</button>
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
  onMeetingCreated={() => setMeetingListKey((key) => key + 1)}
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

                    
                 
