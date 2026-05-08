const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Task = require("../models/Task");
const Quest = require("../models/Quest");
const rateLimit = require("express-rate-limit");

const jwt = require("jsonwebtoken");

const auth = require("../middleware/auth");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many requests, try again later",
});

router.post("/nonce", authLimiter, async (req, res) => {
  try {
    const { wallet } = req.body;

    if (!wallet) {
      return res.status(400).json({ error: "Wallet required" });
    }

    const normalizedWallet = wallet.toLowerCase();

    let user = await User.findOne({ wallet: normalizedWallet });

    if (!user) {
      user = new User({
        wallet: normalizedWallet,
        username: normalizedWallet.slice(0, 6),
      });
    }

    // generate nonce
    user.nonce = Math.random().toString(36).substring(2, 15);
    await user.save();

    const message = `Login to SouqConnect\nNonce: ${user.nonce}`;

    res.json({ message });

  } catch (err) {
    console.error("NONCE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});
// LOGIN / REGISTER WITH WALLET

const { ethers } = require("ethers");

router.post("/auth", authLimiter, async (req, res) => {
  try {
    const { wallet, signature } = req.body;

    if (!wallet || !signature) {
      return res.status(400).json({ error: "Missing data" });
    }

    const normalizedWallet = wallet.toLowerCase();

    const user = await User.findOne({ wallet: normalizedWallet });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const message = `Login to SouqConnect\nNonce: ${user.nonce}`;

    // 🔐 verify signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== normalizedWallet) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // 🔥 rotate nonce (CRITICAL)
    user.nonce = Math.random().toString(36).substring(2, 15);
    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ error: "Missing credential" });
    }

    // verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { sub, email } = payload;

    // 🔍 check if user exists
    let user = await User.findOne({
      $or: [{ googleId: sub }, { email }],
    });

    // 🆕 create if not exists
    if (!user) {
      user = new User({
        username: email.split("@")[0],
        email,
        googleId: sub,
        points: 0,
        completedTasks: [],
        completedQuests: [],
      });

      await user.save();
    }

    // 🔐 create token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ user, token });

  } catch (err) {
    console.error("GOOGLE AUTH ERROR:", err);
    res.status(500).json({ error: "Google login failed" });
  }
});

const axios = require("axios");

router.post("/link-google", authLimiter, auth, async (req, res) => {
  try {
    const { token } = req.body; // 🔥 now expecting access_token

    if (!token) {
      return res.status(400).json({ error: "Missing Google token" });
    }

    // 🔥 Get user info from Google using access_token
    const googleRes = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { sub, email, picture } = googleRes.data;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // prevent linking to another account
    const existing = await User.findOne({ googleId: sub });

    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.status(400).json({
        error: "Google already linked to another account",
      });
    }

    if (user.googleId) {
      return res.status(400).json({ error: "Google already linked" });
    }

    if (!token || typeof token !== "string") {
      return res.status(400).json({ error: "Invalid token format" });
    }

    // ✅ link Google
    user.googleId = sub;
    user.email = email;
    user.googleAvatar = picture
      ? picture.split("=")[0] + "=s200-c"
      : null;

    await user.save();

    res.json({ user });

  } catch (err) {
    console.error("🔥 LINK GOOGLE ERROR:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to link Google" });
  }
});
router.post("/unlink-google", authLimiter, auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.googleId = null;
    user.email = null;

    await user.save();

    res.json({ user });

  } catch (err) {
    console.error("UNLINK ERROR:", err.message);
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

const crypto = require("crypto");
const { profile } = require("console");

// x wahala

router.get("/x/start", auth, (req, res) => {
  const state = crypto.randomBytes(16).toString("hex");

  // store state + user temporarily (in memory or DB)
  global.oauthStates = global.oauthStates || {};
  global.oauthStates[state] = req.user;

  const url = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.X_CLIENT_ID}&redirect_uri=${process.env.X_REDIRECT_URI}&scope=tweet.read users.read offline.access&state=${state}&code_challenge=abcdef123456&code_challenge_method=plain`;

  res.json({ url });
});

router.get("/x/callback", async (req, res) => {
  try {
    const { code, state } = req.query;

    const userId = global.oauthStates?.[state];

    const basicAuth = Buffer.from(
      `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`
    ).toString("base64");


    if (!userId) {
      return res.status(400).send("Invalid state");
    }

    // exchange code for access token
    const tokenRes = await axios.post(
      "https://api.twitter.com/2/oauth2/token",
      new URLSearchParams({
        code,
        grant_type: "authorization_code",
        code,
        client_id: process.env.X_CLIENT_ID,
        redirect_uri: process.env.X_REDIRECT_URI,
        code_verifier: "abcdef123456",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // get user info
    const userRes = await axios.get(
      "https://api.twitter.com/2/users/me",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          "user.fields": "profile_image_url,username",
        },
      }
    );

    const { id, username, profile_image_url } = userRes.data.data;

    const user = await User.findById(userId);

    // ❌ prevent multiple wallets using same X
    const existing = await User.findOne({ twitterId: id });

    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.send("This X account is already linked to another user.");
    }

    user.twitterId = id;
    user.twitterUsername = username;


    await user.save();

    delete global.oauthStates[state];

    res.send(`
      <script>
        window.opener.postMessage({ success: true }, "*");
        window.close();
      </script>
    `);

  } catch (err) {
    console.error("🔥 X CALLBACK ERROR:", err.response?.data || err.message);
    res.send("X linking failed - check backend logs");
  }
});

router.post("/unlink-x", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    user.twitterId = null;
    user.twitterUsername = null;

    await user.save();

    res.json({ user });

  } catch (err) {
    res.status(500).json({ error: "Failed to unlink X" });
  }
});

{/* DISCORD STARTS HERE*/ }

router.get("/discord", async (req, res) => {
  try {
    const token = req.query.token;

    if (!token) {
      return res.status(401).json({ error: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const state = Buffer.from(userId).toString("base64");

    const redirect = `https://discord.com/api/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
      process.env.DISCORD_REDIRECT_URI
    )}&scope=identify&state=${state}`;

    res.redirect(redirect);

  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

const qs = require("querystring");

router.get("/discord/callback", async (req, res) => {
  try {
    const code = req.query.code;

    // exchange code for token
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      qs.stringify({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    // get user info
    const userRes = await axios.get(
      "https://discord.com/api/users/@me",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const state = req.query.state;

    const userId = Buffer.from(state, "base64").toString("ascii");
    const { id, username, avatar } = userRes.data;

    const user = await User.findById(userId);


    // prevent duplicate linking
    const existing = await User.findOne({ discordId: id });
    if (existing && existing._id.toString() !== user._id.toString()) {
      return res.send("Discord already linked to another account");
    }

    user.discordId = id;
    user.discordUsername = username;
    user.discordAvatar = avatar
      ? `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`
      : null;

    await user.save();

    res.send(`
  <script>
    window.opener.postMessage({ success: true }, "*");
    window.close();
  </script>
`);

  } catch (err) {
    console.error("DISCORD ERROR:", err.response?.data || err.message);
    res.send("Discord linking failed");
  }
});

router.post("/unlink-discord", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    user.discordId = null;
    user.discordUsername = null;
    user.discordAvatar = null;

    await user.save();

    res.json({ user });

  } catch (err) {
    console.error("DISCORD UNLINK ERROR:", err.message);

    res.status(500).json({
      error: "Failed to unlink Discord",
    });
  }
});

{/*telegram*/ }

router.post("/link-telegram", auth, async (req, res) => {
  try {
    const data = req.body;

    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // verify telegram hash
    const secret = crypto
      .createHash("sha256")
      .update(process.env.TELEGRAM_BOT_TOKEN)
      .digest();

    const checkString = Object.keys(data)
      .filter((key) => key !== "hash")
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join("\n");

    const hmac = crypto
      .createHmac("sha256", secret)
      .update(checkString)
      .digest("hex");

    if (hmac !== data.hash) {
      return res.status(401).json({
        error: "Invalid Telegram login",
      });
    }

    // prevent duplicates
    const existing = await User.findOne({
      telegramId: data.id,
    });

    if (
      existing &&
      existing._id.toString() !== user._id.toString()
    ) {
      return res.status(400).json({
        error: "Telegram already linked",
      });
    }

    user.telegramId = data.id;
    user.telegramUsername = data.username;
    user.telegramAvatar = data.photo_url || null;

    await user.save();

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("TELEGRAM ERROR:", err.message);

    res.status(500).json({
      error: "Telegram link failed",
    });
  }
});

router.put("/unlink-telegram", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    user.telegramId = null;
    user.telegramUsername = null;
    user.telegramAvatar = null;

    await user.save();

    res.json({ message: "Telegram unlinked" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
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