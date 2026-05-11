const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const Quest = require("../models/Quest");

const auth = require("../middleware/auth");

// LOGIN / REGISTER WITH WALLET

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const axios = require("axios");

// Create user
router.post("/create", async (req, res) => {
  try {
    const user = new User({
      username: "Sheriff",
      wallet: "test_wallet",
      points: 0,
      completedTasks: [],
      completedQuests: []
    });

    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔥 UPDATED: Complete a task + auto quest completion
router.post("/complete-task", auth, async (req, res) => {
  try {
    const { taskId } = req.body;
    const user = await User.findById(req.user);
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).json({ error: "User or Task not found" });
    }

    // prevent duplicate completion
    if (user.completedTasks.includes(taskId)) {
      return res.status(400).json({ error: "Task already completed" });
    }

    // add task + points
    user.completedTasks.push(taskId);
    user.points += task.points;

    // 🔥 find quests containing this task
    const quests = await Quest.find({ tasks: taskId });

    let completedQuestsNow = [];

    for (let quest of quests) {
      const allTasksCompleted = quest.tasks.every(t =>
        user.completedTasks.includes(t.toString())
      );

      const alreadyCompleted = user.completedQuests.includes(quest._id);

      if (allTasksCompleted && !alreadyCompleted) {
        user.completedQuests.push(quest._id);
        user.points += quest.reward;

        completedQuestsNow.push(quest.title);
      }
    }

    await user.save();

    res.json({
      message: "Task completed",
      completedQuests: completedQuestsNow,
      user,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const crypto = require("crypto");
const { profile } = require("console");
const qs = require("querystring");

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;