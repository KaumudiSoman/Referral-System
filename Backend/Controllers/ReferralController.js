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

    res(200).json({
        message: "success",
        data: updatedReferral
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};