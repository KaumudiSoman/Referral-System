const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../Controllers/LeaderboardController');

router.get('/:surveyId', getLeaderboard);

module.exports = router;