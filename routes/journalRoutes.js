const express = require("express");
const {
  createJournal,
  getAllJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  getJournalsByCategory,
  getJournalsByInstitution,
} = require("../controllers/journalController");
const upload = require("../middleware/upload");
const router = express.Router();

// Create a new journal (with file upload)
router.post("/", upload.single("file"), createJournal);

// Get all journals
router.get("/", getAllJournals);

// Get a specific journal by ID
router.get("/:id", getJournalById);

// Update a journal by ID
router.put("/:id", updateJournal);

// Delete a journal by ID
router.delete("/:id", deleteJournal);

// Get journals by category
router.get("/category/:category", getJournalsByCategory);

// Get journals by institution
router.get("/institution/:institution", getJournalsByInstitution);

module.exports = router;
