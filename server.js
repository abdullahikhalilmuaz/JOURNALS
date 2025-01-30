require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
// const newsUpdates = require("./routes/newsUpdates"); // Make sure the filename is correct
const newsRoutes = require("./routes/newsRoutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public")); // Serve images

// Route Handlers (Avoid Overwriting)
app.use("/api/user", userRoutes);
// app.use("/api/news-updates", newsUpdates);
app.use("/api/news", newsRoutes); // Fix conflicting paths

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully!!!"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Academic Journal Repository API");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
