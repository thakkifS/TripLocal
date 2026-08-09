const express = require('express');
const mongoose = require('mongoose');
const Review = require('../models/Review');
const Place = require('../models/Place');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

const reviewMessage = (error) => {
  if (error?.code === 11000) return 'You have already reviewed this place';
  if (error?.name === 'ValidationError') return Object.values(error.errors)[0]?.message || 'Review is invalid';
  return null;
};

// Approved reviews are public.
router.get('/place/:placeId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.placeId)) return res.status(400).json({ message: 'Invalid place ID' });
    const reviews = await Review.find({ place: req.params.placeId, status: 'approved' })
      .populate('user', 'name')
      .sort({ approvedAt: -1, createdAt: -1 });
    const averageRating = reviews.length
      ? Math.round((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length) * 10) / 10
      : 0;
    res.json({ reviews, averageRating, totalReviews: reviews.length });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load reviews' });
  }
});

// A tourist can submit one review per place. It is never public before approval.
router.post('/place/:placeId', auth, async (req, res) => {
  try {
    if (req.user.role !== 'tourist') return res.status(403).json({ message: 'Only tourists can submit reviews' });
    if (!mongoose.isValidObjectId(req.params.placeId)) return res.status(400).json({ message: 'Invalid place ID' });
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || '').trim();
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be a whole number between 1 and 5' });
    }
    if (comment.length < 10 || comment.length > 1000) {
      return res.status(400).json({ message: 'Review must contain between 10 and 1000 characters' });
    }
    if (!await Place.exists({ _id: req.params.placeId })) return res.status(404).json({ message: 'Place not found' });
    const review = await Review.create({ place: req.params.placeId, user: req.user._id, rating, comment });
    res.status(201).json({ message: 'Review submitted and waiting for administrator approval', review });
  } catch (error) {
    const message = reviewMessage(error);
    res.status(message ? (error.code === 11000 ? 409 : 400) : 500).json({ message: message || 'Unable to submit review' });
  }
});

router.get('/admin/pending', adminAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('user', 'name email')
      .populate('place', 'name')
      .sort({ createdAt: 1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load pending reviews' });
  }
});

router.patch('/admin/:id/approve', adminAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid review ID' });
    const review = await Review.findByIdAndUpdate(req.params.id, {
      status: 'approved', approvedBy: req.user._id, approvedAt: new Date()
    }, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review approved', review });
  } catch (error) {
    res.status(500).json({ message: 'Unable to approve review' });
  }
});

router.patch('/admin/:id/reject', adminAuth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid review ID' });
    const review = await Review.findByIdAndUpdate(req.params.id, {
      status: 'rejected', approvedBy: req.user._id, approvedAt: new Date()
    }, { new: true, runValidators: true });
    if (!review) return res.status(404).json({ message: 'Review not found' });
    res.json({ message: 'Review rejected', review });
  } catch (error) {
    res.status(500).json({ message: 'Unable to reject review' });
  }
});

module.exports = router;
