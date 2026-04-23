const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  wallet: {
    type: String,
  },
  points: {
    type: Number,
    default: 0,
  },

  // NEW: track completed tasks
  completedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],

  // NEW: track completed quests
  completedQuests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);