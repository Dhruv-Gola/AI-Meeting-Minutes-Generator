import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5050/api",
});

// Automatically attach the logged-in user's JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const getMeetings = async () => {
  const response = await API.get("/meetings");
  return response.data;
};

export const searchMeetings = async (query) => {
  const response = await API.get(
    `/meetings/search?q=${encodeURIComponent(query)}`
  );
  return response.data;
};

export const getMeetingActionItems = async (meetingId) => {
    const response = await API.get(
        `/meeting-minutes/${meetingId}/action-items`
    );

    return response.data;
};

export const getMeeting = async (meetingId) => {
  const response = await API.get(`/meetings/${meetingId}`);
  return response.data;
};

export const createMeeting = async (meetingData) => {
  const response = await API.post("/meetings", meetingData);
  return response.data;
};

export const generateMinutes = async (meetingId) => {
  const response = await API.post(`/meeting-minutes/${meetingId}/generate`);
  return response.data;
};

export const getMeetingMinutes = async (meetingId) => {
  const response = await API.get(`/meeting-minutes/${meetingId}/minutes`);
  return response.data;
};

export const updateMeetingMinutes = async (meetingId, minutesData) => {
  const response = await API.put(
    `/meeting-minutes/${meetingId}/minutes`,
    minutesData
  );
  return response.data;
};

export const deleteMeetingMinutes = async (meetingId) => {
  const response = await API.delete(
    `/meeting-minutes/${meetingId}/minutes`
  );
  return response.data;
};

export default API;

// your existing api.js code...

// Automatically log out when the JWT token expires
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }

    return Promise.reject(error);
  }
);
