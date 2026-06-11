const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Define the POST route for registration
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;