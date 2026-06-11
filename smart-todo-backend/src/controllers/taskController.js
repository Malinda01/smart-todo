const db = require('../config/db');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Requires Token)
exports.createTask = async (req, res) => {
    const { title } = req.body;
    const userId = req.user.id; // Extracted from the JWT middleware

    if (!title) {
        return res.status(400).json({ message: 'Task title is required' });
    }

    try {
        // Insert the task into the database
        const [result] = await db.execute(
            'INSERT INTO tasks (user_id, title) VALUES (?, ?)',
            [userId, title]
        );

        // Fetch the newly created task to return to the frontend
        const [newTask] = await db.execute(
            'SELECT id, title, is_done FROM tasks WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(newTask[0]);

    } catch (error) {
        console.error('Create Task Error:', error);
        res.status(500).json({ message: 'Server error while creating task' });
    }
};