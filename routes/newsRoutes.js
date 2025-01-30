const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const router = express.Router();
const NEWS_FILE = path.join(__dirname, "..", "database", "news&&update.json");

// Ensure the database directory exists
const DATA_DIR = path.join(__dirname, "..", "database");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// 📌 POST Endpoint: Add a News Post
router.post("/", upload.single("image"), (req, res) => {
  console.log("📩 Incoming request:", req.body);
  console.log("📸 Uploaded file:", req.file);

  try {
    const { email, username, title, body } = req.body;
    if (!email || !username || !title || !body) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPost = {
      user: { email, username },
      date: new Date().toISOString(),
      title,
      image: req.file
        ? `http://localhost:5000/public/uploads/${req.file.filename}`
        : null,
      body,
      likes: [],
      comments: [],
    };

    // Read existing data
    fs.readFile(NEWS_FILE, "utf8", (err, data) => {
      let newsData = [];
      if (!err && data) {
        try {
          newsData = JSON.parse(data);
        } catch (parseError) {
          console.error("❌ JSON Parse Error:", parseError);
        }
      }

      newsData.push(newPost);

      // Write data asynchronously
      fs.writeFile(NEWS_FILE, JSON.stringify(newsData, null, 2), (writeErr) => {
        if (writeErr) {
          console.error("❌ Error writing file:", writeErr);
          return res.status(500).json({ error: "Failed to save news post" });
        }
        console.log("✅ News post saved successfully!");
        res.status(201).json({ message: "News post added", post: newPost });
      });
    });
  } catch (error) {
    console.error("❌ Internal Server Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 📌 GET Endpoint: Fetch News
router.get("/", (req, res) => {
  fs.readFile(NEWS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading file:", err);
      return res.status(500).json({ error: "Failed to fetch news" });
    }
    try {
      const newsData = JSON.parse(data);
      return res.json(newsData);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      return res.status(500).json({ error: "Invalid JSON data" });
    }
  });
});

module.exports = router;
