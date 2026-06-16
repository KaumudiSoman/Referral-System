const Referral = require('../Models/ReferralModel');
const mongoose = require('mongoose');

exports.getLeaderboard = async (req, res) => {
  try {
    const { status, surveyId, search } = req.query;

    let matchStage = {};

    // filter by status
    if (status) {
      matchStage.status = status;
    }

    // filter by survey
    if (surveyId) {
      matchStage.surveyId = new mongoose.Types.ObjectId(surveyId);
    }

    const pipeline = [
      { $match: matchStage },

      // join referrer
      {
        $lookup: {
          from: 'users',
          localField: 'referrerId',
          foreignField: '_id',
          as: 'referrer'
        }
      },
      { $unwind: '$referrer' },

      // join referee
      {
        $lookup: {
          from: 'users',
          localField: 'refereeId',
          foreignField: '_id',
          as: 'referee'
        }
      },
      { $unwind: '$referee' },

      // join survey
      {
        $lookup: {
          from: 'surveys',
          localField: 'surveyId',
          foreignField: '_id',
          as: 'survey'
        }
      },
      { $unwind: '$survey' }
    ];

    // 🔍 SEARCH (by name or phone)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'referrer.name': { $regex: search, $options: 'i' } },
            { 'referee.name': { $regex: search, $options: 'i' } },
            { 'referrer.phone': { $regex: search, $options: 'i' } },
            { 'referee.phone': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // 🎯 FINAL OUTPUT FORMAT
    pipeline.push({
      $project: {
        _id: 0,

        surveyId: '$survey._id',
        surveyName: '$survey.name',

        referrerId: '$referrer._id',
        referrerName: '$referrer.name',

        refereeId: '$referee._id',
        refereeName: '$referee.name',

        status: 1,
        date: '$createdAt'
      }
    });

    const results = await Referral.aggregate(pipeline);

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};