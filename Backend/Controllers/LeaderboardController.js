const Referral = require('../Models/ReferralModel');
const mongoose = require('mongoose');

exports.getLeaderboard = async (req, res) => {
  try {
    const { filters = {}, search } = req.body || {};

    const pipeline = [
      // JOINS
      {
        $lookup: {
          from: 'users',
          localField: 'referrerId',
          foreignField: '_id',
          as: 'referrer'
        }
      },
      { $unwind: '$referrer' },

      {
        $lookup: {
          from: 'users',
          localField: 'refereeId',
          foreignField: '_id',
          as: 'referee'
        }
      },
      { $unwind: '$referee' },

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

    // 🧩 DYNAMIC FILTERS (MULTIPLE)
    let andConditions = [];

    if (filters.surveyName) {
      andConditions.push({
        'survey.name': { $regex: filters.surveyName, $options: 'i' }
      });
    }

    if (filters.referrerName) {
      andConditions.push({
        'referrer.name': { $regex: filters.referrerName, $options: 'i' }
      });
    }

    if (filters.refereeName) {
      andConditions.push({
        'referee.name': { $regex: filters.refereeName, $options: 'i' }
      });
    }

    if (filters.status) {
      andConditions.push({
        status: filters.status
      });
    }

    if (filters.date) {
      const targetDate = new Date(filters.date);

      andConditions.push({
        $and: [
          { 'survey.startDate': { $lte: targetDate } },
          { 'survey.endDate': { $gte: targetDate } }
        ]
      });
    }

    if (andConditions.length > 0) {
      pipeline.push({ $match: { $and: andConditions } });
    }

    // 🌍 GLOBAL SEARCH (optional)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'survey.name': { $regex: search, $options: 'i' } },
            { 'referrer.name': { $regex: search, $options: 'i' } },
            { 'referee.name': { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // 🎯 OUTPUT
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

    res.status(200).json({
      status: 'success',
      data: results
    });

  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};