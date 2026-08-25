import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:5050/api"
});

// -------------------------
// Meetings
// -------------------------

export const getMeetings = async () => {
    const response = await API.get("/meetings");
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

// -------------------------
// Meeting Minutes
// -------------------------

export const generateMinutes = async (meetingId) => {
    const response = await API.post(
        `/meeting-minutes/${meetingId}/generate`
    );

    return response.data;
};

export const getMeetingMinutes = async (meetingId) => {
    const response = await API.get(
        `/meeting-minutes/${meetingId}/minutes`
    );

    return response.data;
};

export const updateMeetingMinutes = async (
    meetingId,
    minutesData
) => {
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