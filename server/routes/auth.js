const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth = require("../middleware/auth");

const router = express.Router();

//signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = User.create({
      username,
      password: hash,
      email,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "email and password required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "incorrect password",
      });
    }
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get the watchlist of a user
router.get("/watchlist", auth, async (req, res) => {
  try {
    // Uses req.userId from auth middleware
    const user = await User.findById(req.userId).populate("watchlist");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get the liked movies list of a user
router.get("/liked", auth, async (req, res) => {
  try {
    // Uses req.userId from auth middleware
    const user = await User.findById(req.userId).populate("likedMovies");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ likedMovies: user.likedMovies });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
