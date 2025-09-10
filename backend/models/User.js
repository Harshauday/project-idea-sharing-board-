const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  phone: {type: String, required: false},
  role: {type: String, enum: ['Student','Mentor','Admin'], default: 'Student'},
  bio: String,
  skills: [String],
  portfolioLink: String,
  points: {type: Number, default:0},
  badges: [String],
}, {timestamps:true});
module.exports = mongoose.model('User', UserSchema);
