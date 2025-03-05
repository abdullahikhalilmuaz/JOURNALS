const Journal = require("../models/journalModel");

// Create a new journal
const createJournal = async (req, res) => {
  const { name, author, institution, category, publicationFrequency } =
    req.body;
  const fileUrl = req.file ? `/uploads/journals/${req.file.filename}` : null; // File path

  if (!fileUrl) {
    return res.status(400).json({ error: "File is required" });
  }

  try {
    const journal = await Journal.create({
      name,
      author,
      institution,
      category,
      publicationFrequency,
      fileUrl,
    });
    res.status(201).json(journal);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all journals
const getAllJournals = async (req, res) => {
  try {
    const journals = await Journal.find().sort({ createdAt: -1 }); // Sort by most recent
    res.status(200).json(journals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a specific journal by ID
const getJournalById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Journal not found" });
  }
  const journal = await Journal.findById(id);
  if (!journal) {
    return res.status(404).json({ error: "Journal not found" });
  }
  res.status(200).json(journal);
};

// Update a journal by ID
const updateJournal = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Journal not found" });
  }
  const journal = await Journal.findByIdAndUpdate(id, req.body, { new: true });
  if (!journal) {
    return res.status(404).json({ error: "Journal not found" });
  }
  res.status(200).json(journal);
};

// Delete a journal by ID
const deleteJournal = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Journal not found" });
  }
  const journal = await Journal.findByIdAndDelete(id);
  if (!journal) {
    return res.status(404).json({ error: "Journal not found" });
  }
  res.status(200).json({ message: "Journal deleted successfully" });
};

// Get journals by category
const getJournalsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const journals = await Journal.find({ category }).sort({ createdAt: -1 });
    res.status(200).json(journals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get journals by institution
const getJournalsByInstitution = async (req, res) => {
  const { institution } = req.params;
  try {
    const journals = await Journal.find({ institution }).sort({
      createdAt: -1,
    });
    res.status(200).json(journals);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createJournal,
  getAllJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  getJournalsByCategory,
  getJournalsByInstitution,
};
