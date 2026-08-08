const express = require('express');
const router = express.Router();
const DayPlan = require('../models/DayPlan');
const Place = require('../models/Place');
const { auth } = require('../middleware/auth');

// Get user's day plan
router.get('/', auth, async (req, res) => {
  try {
    const dayPlan = await DayPlan.findOne({ user: req.user._id })
      .populate('places.place')
      .sort({ 'places.order': 1 });
    
    if (!dayPlan) {
      return res.json({ places: [] });
    }
    
    res.json(dayPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add place to day plan
router.post('/add', auth, async (req, res) => {
  try {
    const { placeId } = req.body;
    
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    
    let dayPlan = await DayPlan.findOne({ user: req.user._id });
    
    if (!dayPlan) {
      dayPlan = new DayPlan({
        user: req.user._id,
        places: [{ place: placeId, order: 1 }]
      });
    } else {
      const existingPlace = dayPlan.places.find(p => p.place.toString() === placeId);
      if (existingPlace) {
        return res.status(400).json({ message: 'Place already in plan' });
      }
      
      const maxOrder = dayPlan.places.length > 0 
        ? Math.max(...dayPlan.places.map(p => p.order)) 
        : 0;
      
      dayPlan.places.push({ place: placeId, order: maxOrder + 1 });
    }
    
    await dayPlan.save();
    await dayPlan.populate('places.place');
    
    res.json(dayPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove place from day plan
router.delete('/remove/:placeId', auth, async (req, res) => {
  try {
    const dayPlan = await DayPlan.findOne({ user: req.user._id });
    
    if (!dayPlan) {
      return res.status(404).json({ message: 'Day plan not found' });
    }
    
    dayPlan.places = dayPlan.places.filter(p => p.place.toString() !== req.params.placeId);
    
    // Reorder remaining places
    dayPlan.places.forEach((p, index) => {
      p.order = index + 1;
    });
    
    await dayPlan.save();
    await dayPlan.populate('places.place');
    
    res.json(dayPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear day plan
router.delete('/clear', auth, async (req, res) => {
  try {
    await DayPlan.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Day plan cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reorder places in day plan
router.put('/reorder', auth, async (req, res) => {
  try {
    const { places } = req.body;
    
    const dayPlan = await DayPlan.findOne({ user: req.user._id });
    
    if (!dayPlan) {
      return res.status(404).json({ message: 'Day plan not found' });
    }
    
    dayPlan.places = places.map((p, index) => ({
      place: p.place,
      order: index + 1
    }));
    
    await dayPlan.save();
    await dayPlan.populate('places.place');
    
    res.json(dayPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
