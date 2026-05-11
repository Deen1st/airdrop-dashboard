const express = require("express");
const taskRoutes = require("./routes/taskRoutes");
const questRoutes = require("./routes/questRoutes");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const socialRoutes = require("./routes/socialRoutes");

const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const rateLimit = require("express-rate-limit");

//  Strict limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // max 20 requests per IP
  message: "Too many requests, try again later",
});
//  Middleware FIRST
app.use(express.json());
app.use(cors());

//  Routes
app.use("/api/tasks", taskRoutes);
app.use("/api/quest", questRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/auth", authRoutes);
app.use("/api/socials", socialRoutes);



// Test create user
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
  res.json({ message: "Backend is running " });
});

// DB
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected "))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});