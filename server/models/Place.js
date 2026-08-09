const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Religious', 'Nature', 'Heritage', 'Cultural', 'Historical', 'Adventure'],
    required: true
  },
  images: [{
    type: String
  }],
  openingHours: {
    monday: String,
    tuesday: String,
    wednesday: String,
    thursday: String,
    friday: String,
    saturday: String,
    sunday: String
  },
  travelTips: [{
    type: String
  }],
  address: {
    type: String,
    required: true
  },
  locationUrl: {
    type: String,
    trim: true,
    maxlength: 2000,
    validate: {
      validator: (value) => !value || /^https:\/\/(?:www\.)?(?:google\.com|maps\.google\.com|maps\.app\.goo\.gl|goo\.gl|openstreetmap\.org)(?:\/|$)/i.test(value),
      message: 'Location link must be a valid Google Maps or OpenStreetMap HTTPS URL'
    }
  },
  location: {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  distanceFromHome: {
    type: Number,
    required: true,
    min: 0,
    max: 25
  },
  estimatedVisitDuration: {
    type: Number,
    default: 60,
    min: 1,
    max: 1440
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

placeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Place', placeSchema);
