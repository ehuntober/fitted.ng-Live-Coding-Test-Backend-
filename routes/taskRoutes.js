const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const userAuthorizationMiddleware = require('../middlewares/userAuthorizationMiddleware');



const router = express.Router();

// Protected routes for Super Admin
router.post('/v1/tasks', authMiddleware, taskController.createTask);
router.get('/v1/tasks', authMiddleware, taskController.getAllTasks);
router.get('/v1/tasks/:id', authMiddleware, taskController.getTaskById);
router.delete('/v1/tasks/:id', authMiddleware, taskController.deleteTaskById);
router.put('/v1/tasks/:id', authMiddleware, taskController.updateTaskById);
router.post('/v1/tasks/bulkadd', authMiddleware, taskController.bulkAddTasks);
router.post('/v1/tasks/bulkdelete', authMiddleware, taskController.bulkDeleteTasks);

// Protected routes for ordinary users with limited access
router.get('/tasks/assigned', authMiddleware, taskController.getTasksAssignedToUser);
// router.get('/v1/tasks/:id', authMiddleware, userAuthorizationMiddleware, taskController.getTaskById);
// router.put('/v1/tasks/:id', authMiddleware, userAuthorizationMiddleware, taskController.updateTaskById);



module.exports = router;
