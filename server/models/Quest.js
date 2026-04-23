const mongoose = require("mongoose");

const questSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

   type: {
    type: String,
    enum: ["social", "trading", "onboarding"],
    default: "social"
  },
  
  // tasks inside this quest
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],

  reward: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Quest", questSchema);