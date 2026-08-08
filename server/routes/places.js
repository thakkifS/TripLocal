const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Place = require('../models/Place');
const { auth, adminAuth } = require('../middleware/auth');

// Configure multer for image uploads
const uploadsDirectory = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const normalizePlaceBody = (body) => {
  const data = { ...body };
  const openingHours = {};
  Object.entries(body).forEach(([key, value]) => {
    const match = key.match(/^openingHours\[([^\]]+)\]$/);
    if (match) { openingHours[match[1]] = value; delete data[key]; }
  });
  const indexedTips = Object.entries(body)
    .filter(([key]) => /^travelTips\[\d+\]$/.test(key))
    .sort(([a], [b]) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
  if (indexedTips.length) {
    data.travelTips = indexedTips.map(([, value]) => value).filter(Boolean);
    indexedTips.forEach(([key]) => delete data[key]);
  }
  if (Object.keys(openingHours).length) data.openingHours = openingHours;
  if (body.latitude !== undefined || body.longitude !== undefined) {
    data.location = { latitude: Number(body.latitude), longitude: Number(body.longitude) };
    delete data.latitude; delete data.longitude;
  }
  if (body.distanceFromHome !== undefined) data.distanceFromHome = Number(body.distanceFromHome);
  if (body.estimatedVisitDuration !== undefined) data.estimatedVisitDuration = Number(body.estimatedVisitDuration);
  if (body.travelTips && !Array.isArray(body.travelTips)) data.travelTips = [body.travelTips];
  return data;
};

const upload = multer({ 
  storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Images only!'));
  }
});

// Get all places
router.get('/', async (req, res) => {
  try {
    const { category, search, distance } = req.query;
    
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (distance) {
      const [min, max] = distance.split('-').map(Number);
      query.distanceFromHome = { $gte: min, $lte: max };
    }
    
    const places = await Place.find(query).sort({ distanceFromHome: 1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get categories (declared before /:id so "categories" is not treated as an id)
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Place.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single place
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create place (admin only)
router.post('/', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const place = new Place({
      ...normalizePlaceBody(req.body),
      images: imagePaths
    });
    
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update place (admin only)
router.put('/:id', adminAuth, upload.array('images', 5), async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    const updates = normalizePlaceBody(req.body);
    let retainedImages = place.images;
    if (req.body.existingImages) {
      try { retainedImages = JSON.parse(req.body.existingImages); } catch (_) { retainedImages = place.images; }
      delete updates.existingImages;
    }
    const newImages = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    updates.images = [...retainedImages, ...newImages].slice(0, 5);
    Object.assign(place, updates);
    await place.save();
    
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete place (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    await Place.findByIdAndDelete(req.params.id);
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
