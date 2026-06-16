const User = require('../Models/UserModel');
const Referral = require('../Models/ReferralModel');
const crypto = require('crypto');

// helper to generate referral code
const generateReferralCode = () => {
  return crypto.randomBytes(4).toString('hex');
};

exports.registerUser = async (req, res) => {
  try {
    const { name, phone, city, referredBy, surveyId } = req.body;

    // create new user
    const newUser = new User({
      name,
      phone,
      city,
      referralCode: generateReferralCode(),
      referredBy: referredBy || null
    });

    const savedUser = await newUser.save();

    // if user was referred
    if (referredBy) {
      const referrer = await User.findOne({ referralCode: referredBy });

      if (referrer) {
        // add to referrer’s referrals list
        referrer.referrals.push(savedUser._id);
        await referrer.save();

        // create referral tracking entry
        await Referral.create({
          referrerId: referrer._id,
          refereeId: savedUser._id,
          surveyId: surveyId,
          status: 'LEAD'
        });
      }
    }

    res.status(201).json({
        message: "success",
        data: savedUser
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};