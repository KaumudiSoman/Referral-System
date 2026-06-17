const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../Controllers/LeaderboardController');

router.post('/', getLeaderboard);

module.exports = router;