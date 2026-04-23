const express = require("express");
const router = express.Router();
const Quest = require("../models/Quest");

router.get("/:id", async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id).populate("tasks");

    if (!quest) {
      return res.status(404).json({ error: "Quest not found" });
    }

    res.json(quest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a quest
router.post("/create", async (req, res) => {
  try {
    const { title, description, tasks, reward } = req.body;

    const quest = new Quest({ title, description, tasks, reward });
    await quest.save();

    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create multiple quests
router.post("/bulk", async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Body must be an array" });
    }

    const quests = await Quest.insertMany(req.body);

    res.status(201).json(quests);
  } catch (error) {
    console.error("Bulk error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get all quests (with tasks populated)
router.get("/", async (req, res) => {
  try {
    const quests = await Quest.find().populate("tasks");
    res.json(quests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;