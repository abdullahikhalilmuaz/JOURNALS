require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to the Academic Journal Repository API");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
