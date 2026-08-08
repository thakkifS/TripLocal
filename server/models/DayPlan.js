const mongoose = require('mongoose');

const dayPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  places: [{
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DayPlan', dayPlanSchema);
