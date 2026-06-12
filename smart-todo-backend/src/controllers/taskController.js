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

// --------------------------------------------------------------------------------------------

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private (Requires Token)
exports.getTasks = async (req, res) => {
    const userId = req.user.id; // Extracted from the JWT middleware

    try {
        // Fetch tasks only for this specific user, newest first
        const [tasks] = await db.execute(
            'SELECT id, title, is_done FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // MySQL stores booleans as 0 or 1. Let's convert them to true/false
        // so it perfectly matches your original API design.
        const formattedTasks = tasks.map(task => ({
            id: task.id,
            title: task.title,
            is_done: task.is_done === 1
        }));

        res.status(200).json(formattedTasks);

    } catch (error) {
        console.error('Get Tasks Error:', error);
        res.status(500).json({ message: 'Server error while fetching tasks' });
    }
};

// --------------------------------------------------------------------------------------------

// @route   PUT /api/tasks/:id
// @desc    Update a task (title or is_done status)
// @access  Private
exports.updateTask = async (req, res) => {
    const taskId = req.params.id; // Get the ID from the URL
    const userId = req.user.id;   // Get the user ID from the token
    const { title, is_done } = req.body; // Get the new data from the request

    try {
        // 1. Check if the task exists AND belongs to this specific user
        const [tasks] = await db.execute(
            'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
            [taskId, userId]
        );

        if (tasks.length === 0) {
            return res.status(404).json({ message: 'Task not found or not authorized' });
        }

        const existingTask = tasks[0];

        // 2. Allow updating just the title, just the status, or both.
        // If a field isn't provided in the request, keep the existing value.
        const updatedTitle = title !== undefined ? title : existingTask.title;
        
        // Convert boolean true/false to 1/0 for MySQL if is_done is provided
        let updatedIsDone = existingTask.is_done;
        if (is_done !== undefined) {
            updatedIsDone = is_done ? 1 : 0;
        }

        // 3. Update the database
        await db.execute(
            'UPDATE tasks SET title = ?, is_done = ? WHERE id = ?',
            [updatedTitle, updatedIsDone, taskId]
        );

        // 4. Send back the updated task format
        res.status(200).json({
            id: parseInt(taskId),
            title: updatedTitle,
            is_done: updatedIsDone === 1
        });

    } catch (error) {
        console.error('Update Task Error:', error);
        res.status(500).json({ message: 'Server error while updating task' });
    }
};