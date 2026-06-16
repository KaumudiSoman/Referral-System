const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  city: {
    type: String
  },
  referralCode: {
    type: String,
    unique: true,
    required: true
  },
  referredBy: {
    type: String, // stores referralCode of parent
    default: null
  },
  referrals: [{
    type: mongoose.Schema.Types.ObjectId, // stores references of the referrals
    ref: 'User'
  }]
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('User', userSchema);