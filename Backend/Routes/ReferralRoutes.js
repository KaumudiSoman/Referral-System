const express = require('express');
const router = express.Router();
const { updateStatus } = require('../Controllers/referralController');

router.put('/:id', updateStatus);

module.exports = router;