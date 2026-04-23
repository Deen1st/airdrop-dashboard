const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Create a task
router.post("/create", async (req, res) => {
  try {
    const { title, description, points } = req.body;

    const task = new Task({ title, description, points });
    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create multiple quests
router.post("/bulk", async (req, res) => {
  try {
    const tasks = await Task.insertMany(req.body);
    res.status(201).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;