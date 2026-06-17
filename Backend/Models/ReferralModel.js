const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId, // referred by
    ref: 'User',
    required: true
  },
  refereeId: {
    type: mongoose.Schema.Types.ObjectId, // referred to
    ref: 'User',
    required: true,
    validate: {
      validator: function (value) {
        return value.toString() !== this.referrerId.toString(); // referrer != referee
      },
      message: 'Referrer and referee cannot be the same user'
    }
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  status: {
    type: String,
    enum: ['LEAD', 'FIT', 'COMPLETED'],
    default: 'LEAD'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Referral', referralSchema);