const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");

const auth = require("../middleware/auth");

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