const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('../routes/auth'));
app.use('/api/places', require('../routes/places'));
app.use('/api/dayplan', require('../routes/dayplan'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TripLocal server is running' });
});

module.exports = app;
