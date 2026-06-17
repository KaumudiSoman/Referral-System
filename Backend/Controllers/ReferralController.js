const Referral = require('../Models/ReferralModel');

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedReferral = await Referral.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
        message: "success",
        data: updatedReferral
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeSurvey = async (req, res) => {
  const { userId } = req.body;
  const { surveyId } = req.params;

  const referral = await Referral.findOne({
    referee: userId,
    survey: surveyId
  });

  if (!referral) {
    return res.status(404).json({ message: "Referral not found" });
  }

  if (referral.status !== "FIT") {
    return res.status(400).json({
      message: "User not qualified yet"
    });
  }

  referral.status = "COMPLETED";
  await referral.save();

  res.json({ message: "Survey completed & referral updated" });
};