const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth')();

// create project
router.post('/', auth, async (req,res)=>{
  try{
    const data = req.body;
    data.author = req.user.id;
    const p = await Project.create(data);
    // increment user points
    await User.findByIdAndUpdate(req.user.id, {$inc:{points:10}});
    res.json(p);
  }catch(e){console.error(e); res.status(500).json({error:'server'})}
});

// get projects with basic search & filters
router.get('/', async (req,res)=>{
  try{
    const {q,tag,tech,category,page=1,limit=12} = req.query;
    const filter = {};
    if(tag) filter.tags = tag;
    if(tech) filter.techStack = tech;
    if(category) filter.category = category;
    if(q) filter.$or = [
      {title: {$regex: q, $options:'i'}},
      {shortDesc: {$regex:q, $options:'i'}},
      {tags: {$regex: q, $options:'i'}}
    ];
    const projects = await Project.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(parseInt(limit)).populate('author','name');
    res.json(projects);
  }catch(e){console.error(e); res.status(500).json({error:'server'})}
});

// like/unlike
router.post('/:id/like', auth, async (req,res)=>{
  try{
    const p = await Project.findById(req.params.id);
    if(!p) return res.status(404).json({error:'not found'});
    const idx = p.likes.findIndex(x => x.toString() === req.user.id);
    if(idx===-1){ p.likes.push(req.user.id); await p.save(); return res.json({liked:true}); }
    p.likes.splice(idx,1); await p.save(); res.json({liked:false});
  }catch(e){console.error(e); res.status(500).json({error:'server'})}
});

// follow
router.post('/:id/follow', auth, async (req,res)=>{
  try{
    const p = await Project.findById(req.params.id);
    if(!p) return res.status(404).json({error:'not found'});
    const idx = p.followers.findIndex(x => x.toString() === req.user.id);
    if(idx===-1){ p.followers.push(req.user.id); await p.save(); return res.json({following:true}); }
    p.followers.splice(idx,1); await p.save(); res.json({following:false});
  }catch(e){console.error(e); res.status(500).json({error:'server'})}
});

// comment
router.post('/:id/comment', auth, async (req,res)=>{
  try{
    const {text} = req.body;
    const p = await Project.findById(req.params.id);
    if(!p) return res.status(404).json({error:'not found'});
    p.comments.push({user:req.user.id, text});
    await p.save();
    res.json({ok:true});
  }catch(e){console.error(e); res.status(500).json({error:'server'})}
});

// add version
router.post('/:id/version', auth, async (req,res)=>{
  try{
    const {versionName,changelog,assets} = req.body;
    const p = await Project.findById(req.params.id);
    if(!p) return res.status(404).json({error:'not found'});
    p.versions.push({versionName,changelog,assets});
    await p.save();
    res.json({ok:true});
  }catch(e){console.error(e); res.status(500).json({error:'server'})}
});

// detail
router.get('/:id', async (req,res)=>{
  try{
    const p = await Project.findById(req.params.id).populate('author','name skills');
    if(!p) return res.status(404).json({error:'not found'});
    p.views = (p.views || 0) + 1;
    await p.save();
    res.json(p);
  }catch(e){console.error(e); res.status(500).json({error:'server'})}
});

module.exports = router;
