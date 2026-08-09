const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  photos: [{ type: String, maxlength: 1500000 }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date
}, { timestamps: true });

reviewSchema.index({ place: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
