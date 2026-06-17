const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  criteria: {
    type: String
  },
  city: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Survey', surveySchema);