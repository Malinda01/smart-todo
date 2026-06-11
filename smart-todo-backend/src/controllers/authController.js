const bcrypt = require('bcrypt');
const db = require('../config/db'); // Our database pool

// @route   POST /api/auth/register
// @desc    Register a new user
exports.registerUser = async (req, res) => {
    // 1. Extract data from the request body
    const { name, email, password } = req.body;

    // 2. Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        // 3. Check if the user already exists in the database
        const [existingUsers] = await db.execute(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // 4. Hash the password before saving it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Insert the new user into the database
        await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // 6. Send success response (matching your API design)
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};