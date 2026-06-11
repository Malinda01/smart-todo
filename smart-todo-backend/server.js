require('dotenv').config();
const express = require('express');
const cors = require('cors');

// This will run the db.js file and trigger the connection test
require('./src/config/db'); 

const app = express();

// Global Middleware
app.use(cors()); // Allows your React frontend to communicate with this API
app.use(express.json()); // Allows Express to parse incoming JSON payloads

// --- ROUTES ---
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes); // This prefixes all auth routes with /api/auth

// A simple sanity check route
app.get('/', (req, res) => {
    res.json({ message: 'Smart To-Do API is running...' });
});

// Define the port from .env, or fallback to 5000
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});