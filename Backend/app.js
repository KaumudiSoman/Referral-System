const express = require('express');
const cors = require('cors');
const UserRouter = requrie('./Routes/UserRoutes');
const SurveyRouter = require('./Routes/SurveyRoutes');
const ReferralRouter = require('./Routes/ReferralRoutes');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/users', UserRouter);
app.use('/api/survey', SurveyRouter);
app.use('/api/referrals', ReferralRouter);

module.exports = app;