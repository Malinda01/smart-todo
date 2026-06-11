const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // Import the middleware

// Apply the 'protect' middleware to the POST route
router.post('/', protect, createTask);
router.get('/', protect, getTasks);

module.exports = router;