const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers } = require('../Controllers/UserController');

router.post('/register', registerUser);
router.get('/', getAllUsers);

module.exports = router;