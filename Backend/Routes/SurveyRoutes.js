const express = require('express');
const router = express.Router();
const { createSurvey } = require('../Controllers/SurveyController');

router.post('/', createSurvey);

module.exports = router;