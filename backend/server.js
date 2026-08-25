const express = require("express");
const cors = require("cors");
require("dotenv").config();

const meetingMinutesRoutes = require("./routes/meetingMinutesRoutes");

const meetingRoutes = require("./routes/meetingRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
}); 

// Meeting routes
 app.use("/api/meetings", meetingRoutes);
 app.use("/api/meeting-minutes", meetingMinutesRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Meeting Minutes Generator API is running!"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});