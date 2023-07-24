const Task = require('../models/task');
const User = require('../models/user');


exports.getTaskById = async (req, res) => {
  const taskId = req.params.id;
  try {
    // Find the task by ID
    const task = await Task.findById(taskId);
    // If the task is not found, return an error
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if the user is a Super Admin or if the task is assigned to the user
    if (req.user.role === 'Super Admin' || task.assignedUser === req.user._id) {
      return res.status(200).json(task);
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error fetching task by ID:', err);
    res.status(404).json({ error: "There is no task at that id"
  });
  }
};



exports.updateTaskById = async (req, res) => {
  const taskId = req.params.id;
  const { title, is_completed } = req.body;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    // If the task is not found, return an error
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if the user is a Super Admin or if the task is assigned to the user
    if (req.user.role === 'Super Admin' || task.assignedUser === req.user._id) {
      // Update the task with the provided data
      task.title = title;
      task.is_completed = is_completed;
      await task.save();

      return res.status(204).end();
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error updating task by ID:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};





exports.createTask = async (req, res) => {
  const { title, assignedUser, is_completed } = req.body;

  try {
    // Check if the user is a Super Admin or if the task is assigned to the user
    if (req.user.role === 'Super Admin') {
      let assignedUserId = null;

      if (assignedUser) {
        // Find the user by their username in the database
        const user = await User.findOne({ username: assignedUser });

        // If the user is not found, return an error
        if (!user) {
          return res.status(404).json({ error: 'Assigned user not found' });
        }

        assignedUserId = user._id;
      }

      // Create a new task with the provided data
      const task = await Task.create({
        title,
        assignedUser: assignedUserId,
        is_completed,
      });

      return res.status(201).json({ id: task._id });
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};













exports.deleteTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    // Find the task by ID
    const task = await Task.findById(taskId);

    // If the task is not found, return an error
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if the user is a Super Admin or if the task is assigned to the user
    if (req.user.role === 'Super Admin' || task.assignedUser === req.user._id) {
      // Delete the task
      await task.remove();

      return res.status(204).end();
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error deleting task by ID:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
























exports.bulkAddTasks = async (req, res) => {
  const { tasks } = req.body;

  try {
    // Check if the user is a Super Admin or if the tasks are assigned to the user
    if (req.user.role === 'Super Admin' || tasks.every((task) => task.assignedUser === req.user._id)) {
      // Create an array to store the newly created task IDs
      const taskIds = [];

      // Loop through each task and create it
      for (const taskData of tasks) {
        const task = await Task.create(taskData);
        taskIds.push({ id: task._id });
      }

      return res.status(201).json({ tasks: taskIds });
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error bulk adding tasks:', err);
    res.status(500).json({ error: 'Failed to bulk add tasks' });
  }
};



exports.bulkDeleteTasks = async (req, res) => {
  const { tasks } = req.body;

  try {
    // Check if the user is a Super Admin or if the tasks are assigned to the user
    if (req.user.role === 'Super Admin' || tasks.every((taskId) => isTaskAssignedToUser(taskId, req.user._id))) {
      // Loop through each task and delete it
      for (const taskId of tasks) {
        await Task.findByIdAndRemove(taskId);
      }

      return res.status(204).end();
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error bulk deleting tasks:', err);
    res.status(500).json({ error: 'Failed to bulk delete tasks' });
  }
};

// Helper function to check if a task is assigned to a specific user
async function isTaskAssignedToUser(taskId, userId) {
  const task = await Task.findById(taskId);
  return task && task.assignedUser === userId;
}




exports.getAllTasks = async (req, res) => {
  try {
    // Check if the user is a Super Admin
    if (req.user.role === 'Super Admin') {
      // Fetch all tasks from the database
      const tasks = await Task.find();

      return res.status(200).json({ tasks });
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error fetching all tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};