const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new task (for Super Admin only)
router.post('/v1/tasks', authMiddleware, taskController.createTask);

// List all tasks created (for Super Admin only)
router.get('/v1/tasks', authMiddleware, taskController.getAllTasks);

// Get a specific task by ID (for both Super Admin and assigned user)
router.get('/v1/tasks/:id', authMiddleware, taskController.getTaskById);

// Delete a specific task by ID (for both Super Admin and assigned user)
router.delete('/v1/tasks/:id', authMiddleware, taskController.deleteTaskById);

// Edit the title or completion of a specific task by ID (for both Super Admin and assigned user)
router.put('/v1/tasks/:id', authMiddleware, taskController.updateTaskById);

// Bulk add tasks (for Super Admin only)
router.post('/v1/tasks/bulkadd', authMiddleware, taskController.bulkAddTasks);

// Bulk delete tasks (for Super Admin only)
router.delete('/v1/tasks/bulkdelete', authMiddleware, taskController.bulkDeleteTasks);

module.exports = router;
