const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Journal name
  author: { type: String, required: true }, // Author's name
  institution: { type: String, required: true }, // Institution name
  category: { type: String, required: true }, // Category (e.g., Science, Education, Languages)
  publicationFrequency: { type: String, required: true }, // Frequency (e.g., Monthly, Quarterly)
  fileUrl: { type: String, required: true }, // Path to the uploaded file
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Journal", journalSchema);
