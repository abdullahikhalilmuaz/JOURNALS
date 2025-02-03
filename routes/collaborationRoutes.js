const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/userModel.js");
const CollaborationGroup = require("../models/collaborationModel.js");

// ✅ Create Group Route
router.post("/create-group", async (req, res) => {
  try {
    let { name, members, createdBy } = req.body;

    if (!name || !members || !createdBy) {
      return res
        .status(400)
        .json({ error: "Group name, members, and creator are required." });
    }

    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    createdBy = new mongoose.Types.ObjectId(createdBy);

    const creator = await User.findById(createdBy);
    if (!creator) {
      return res.status(404).json({ error: "User not found" });
    }

    const validMembers = members.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!validMembers) {
      return res.status(400).json({ error: "Invalid member ID(s) format" });
    }

    members = members.map((id) => new mongoose.Types.ObjectId(id));

    const group = await CollaborationGroup.create({ name, members, createdBy });

    for (const memberId of members) {
      const user = await User.findById(memberId);
      if (user) {
        user.notifications.push({
          message: `You have been added to the group: ${name}`,
          groupId: group._id,
        });
        await user.save();
      }
    }

    for (const memberId of members) {
      await User.findByIdAndUpdate(memberId, {
        $push: { groups: group._id },
      });
    }

    await User.findByIdAndUpdate(createdBy, {
      $push: { groups: group._id },
    });

    res.status(201).json({ message: "Group created successfully!", group });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Fetch user ID by email
router.get("/get-user-id", async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ userId: user._id }); // Return the user ID
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch notifications for a specific user
router.get("/notifications", async (req, res) => {
  try {
    const email = req.query.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "username email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;
