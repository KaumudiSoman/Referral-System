const express = require('express');
const cors = require('cors');
const UserRouter = require('./Routes/UserRoutes');
const SurveyRouter = require('./Routes/SurveyRoutes');
const ReferralRouter = require('./Routes/ReferralRoutes');
const LeaderboardRouter = require('./Routes/LeaderboardRoutes');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/users', UserRouter);
app.use('/api/survey', SurveyRouter);
app.use('/api/referrals', ReferralRouter);
app.use('/api/leaderboard', LeaderboardRouter);


module.exports = app;