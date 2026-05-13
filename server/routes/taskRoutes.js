const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Quest = require("../models/Quest");
const User = require("../models/User");

const auth = require("../middleware/auth");


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

// UPDATED: Complete a task + auto quest completion
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

    //  find quests containing this task
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