const express = require('express');
const router = express.Router();
const { getLeaderboard, getMetrics } = require('../Controllers/LeaderboardController');

router.post('/', getLeaderboard);
router.get('/metrics', getMetrics);

module.exports = router;