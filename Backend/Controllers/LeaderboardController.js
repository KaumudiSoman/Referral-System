const mongoose = require('mongoose');
const Referral = require('../Models/ReferralModel');
const User = require('../Models/UserModel');
const Survey = require('../Models/SurveyModel');

exports.getLeaderboard = async (req, res) => {
  try {
    const { filters = {}, search } = req.body || {};

    const pipeline = [
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

    // Filters
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

    // Global Search
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'survey.name': { $regex: search, $options: 'i' } },
            { 'referrer.name': { $regex: search, $options: 'i' } },
            { 'referee.name': { $regex: search, $options: 'i' } },
            { status: { $regex: search, $options: 'i' } },
            {
              $expr: {
                $regexMatch: {
                  input: { $toString: '$_id' },
                  regex: search,
                  options: 'i'
                }
              }
            }
          ]
        }
      });
    }

    pipeline.push({
      $project: {
        _id: 0,
        surveyId: '$survey._id',
        surveyName: '$survey.name',
        referralId: '$_id', 
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

exports.getMetrics = async(req, res) => {
  try {
    const [
      totalUsers,
      totalSurveys,
      totalReferrals,
      totalLead,
      totalFit,
      totalCompleted
    ] = await Promise.all([
      User.countDocuments(),
      Survey.countDocuments(),
      Referral.countDocuments(),
      Referral.countDocuments({ status: 'LEAD' }),
      Referral.countDocuments({ status: 'FIT' }),
      Referral.countDocuments({ status: 'COMPLETED' })
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        totalUsers,
        totalSurveys,
        totalReferrals,
        totalLead,
        totalFit,
        totalCompleted
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
}