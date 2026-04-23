const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const questRoutes = require("./routes/questRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");

const mongoose = require("mongoose");
require("dotenv").config();

const app = express();//creates the app
app.use(cors());
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/quest", questRoutes);

//routes
app.use("/api/users", userRoutes);

app.post("/api/users/create", async (req, res) => {
  try {
    const user = new User({
      username: "Sheriff",
      points: 0,
      completedTasks: []
    });

    await user.save();

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected ✅"))
.catch(err => console.log(err));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("ENV:", process.env.MONGO_URI);
});