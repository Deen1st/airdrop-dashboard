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
  googleAvatar: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
  },
  email: {
    type: String,
  },

  twitterId: {
    type: String,
  },
  twitterUsername: {
    type: String,
  },
  twitterAvatar: {
    type: String,
    default: null,
  },

  discordId: {
    type: String,
  },
  discordUsername: {
    type: String,
  },
  discordAvatar: {
    type: String,
  },

  telegramId: {
    type: String,
  },
  telegramUsername: {
    type: String,
  },
  telegramAvatar: {
    type: String,
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

  nonce: {
    type: String,
    default: () => Math.random().toString(36).substring(2, 15),
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);