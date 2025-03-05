require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 5000;

// Import routes
const userRoutes = require("./routes/user");
const newsRoutes = require("./routes/newsRoutes");
const collaborationRoutes = require("./routes/collaborationRoutes");
const messageRoute = require("./routes/messageRoutes");
const journalRoutes = require("./routes/journalRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Route Handlers
app.get("/", (req, res) => {
  res.json({ message: `server started on port ${PORT}` });
});

// Use routes
app.use("/api/user", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/collaboration", collaborationRoutes);
app.use("/api", messageRoute);
app.use("/api/journals", journalRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
