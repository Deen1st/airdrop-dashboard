const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  points: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Task", taskSchema);