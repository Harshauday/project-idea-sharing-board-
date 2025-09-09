const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')(['Admin']);
const User = require('../models/User');
const Project = require('../models/Project');

router.get('/stats', auth, async (req,res)=>{
  const users = await User.countDocuments();
  const projects = await Project.countDocuments();
  res.json({users, projects});
});

module.exports = router;
