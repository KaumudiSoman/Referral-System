const Survey = require('../Models/SurveyModel');

exports.createSurvey = async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    const savedSurvey = await newSurvey.save();
    res.status(201).json({
        message: "success",
        data: savedSurvey
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};