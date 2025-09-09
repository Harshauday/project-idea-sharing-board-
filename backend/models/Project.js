const mongoose = require('mongoose');
const VersionSchema = new mongoose.Schema({
  versionName: String,
  changelog: String,
  createdAt: {type: Date, default: Date.now},
  assets: [String] // urls
});
const CommentSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  createdAt: {type: Date, default: Date.now}
});

const ProjectSchema = new mongoose.Schema({
  title: {type: String, required:true},
  shortDesc: String,
  description: String,
  tags: [String],
  techStack: [String],
  repoUrl: String,
  demoUrl: String,
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  versions: [VersionSchema],
  likes: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  followers: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  comments: [CommentSchema],
  views: {type:Number, default:0},
  category: String,
}, {timestamps:true});

module.exports = mongoose.model('Project', ProjectSchema);
