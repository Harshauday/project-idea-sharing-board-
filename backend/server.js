require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const adminRoutes = require('./routes/admin');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => res.send({status: 'ok', env: process.env.NODE_ENV || 'dev'}));

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/outboxlabs';
mongoose.connect(MONGO, {useNewUrlParser:true, useUnifiedTopology:true})
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(port, ()=> console.log('Server running on', port));
  }).catch(err => {
    console.error('DB connection error', err);
    process.exit(1);
  });
