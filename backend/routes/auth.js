const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, tokenExpiry } = require("../config/jwt");

// signup
router.post("/register", async (req, res) => {
  try {
    console.log("========== REGISTRATION ATTEMPT ==========");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { name, email, password, role, phone } = req.body;
    
    // Check for missing fields
    if (!email || !password || !name) {
      console.log("Registration failed: missing fields");
      console.log("Email present:", !!email);
      console.log("Password present:", !!password);
      console.log("Name present:", !!name);
      return res.status(400).json({ error: "missing fields" });
    }
    
    // Check if user exists
    let exists = await User.findOne({ email });
    if (exists) {
      console.log("Registration failed: User exists with email", email);
      return res.status(400).json({ error: "User exists" });
    }
    
    console.log("Creating new user with email:", email);
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role, phone });
    
    console.log("User created successfully:", user._id);
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email, phone: user.phone },
      jwtSecret,
      { expiresIn: tokenExpiry }
    );
    
    console.log("Registration successful, sending response");
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (e) {
    console.error("Registration error:", e);
    res.status(500).json({ error: "server" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    console.log("========== LOGIN ATTEMPT ==========");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    
    const { email, password } = req.body;
    
    if (!email || !password) {
      console.log("Login failed: missing fields");
      return res.status(400).json({ error: "missing" });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: no user found with email", email);
      return res.status(400).json({ error: "no user" });
    }
    
    console.log("User found, comparing passwords");
    const ok = await bcrypt.compare(password, user.password);
    
    if (!ok) {
      console.log("Login failed: invalid password for user", email);
      return res.status(401).json({ error: "invalid" });
    }
    
    console.log("Login successful for user:", email);
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email, phone: user.phone },
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
        phone: user.phone,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "server" });
  }
});

module.exports = router;
