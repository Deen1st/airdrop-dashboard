const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { ethers } = require("ethers");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

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

module.exports = router;