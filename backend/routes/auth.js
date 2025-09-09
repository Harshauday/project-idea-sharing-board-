const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, tokenExpiry } = require("../config/jwt");

// signup
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: "missing fields" });
    let exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "User exists" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      jwtSecret,
      { expiresIn: tokenExpiry }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "missing" });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "no user" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid" });
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      jwtSecret,
      { expiresIn: tokenExpiry }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

module.exports = router;
