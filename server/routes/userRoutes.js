const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const Quest = require("../models/Quest");

const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");
// LOGIN / REGISTER WITH WALLET

router.post("/auth", async (req, res) => {
  try {
    const { wallet } = req.body;

    if (!wallet) {
      return res.status(400).json({ error: "Wallet required" });
    }

    // check if user exists
    let user = await User.findOne({ wallet });

    // if not → create
    if (!user) {
      user = new User({
        username: wallet.slice(0, 6), // short name
        wallet,
        points: 0,
        completedTasks: [],
        completedQuests: []
      });

      await user.save();
    }

    // create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
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

module.exports = router;