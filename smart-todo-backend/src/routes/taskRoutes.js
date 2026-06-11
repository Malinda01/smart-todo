const express = require('express');
const router = express.Router();
const { createTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // Import the middleware

// Apply the 'protect' middleware to the POST route
router.post('/', protect, createTask);

module.exports = router;