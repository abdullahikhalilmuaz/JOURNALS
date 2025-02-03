require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Import routes
const userRoutes = require("./routes/user");
const newsRoutes = require("./routes/newsRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes"); // Collaboration routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "build")));

// Route Handlers
app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/collaboration", collaborationRoutes); // Ensure this line exists

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!!!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Academic Journal Repository API");
});

// Handle client-side routing - Serve index.html for all unmatched routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
