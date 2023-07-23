const Task = require('../models/task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const task = await Task.create(taskData);
    res.status(201).json({ id: task._id });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// List all tasks created
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'There is no task at that id' });
    }
    res.status(200).json(task);
  } catch (err) {
    console.error('Error fetching task:', err);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

// Delete a specific task by ID
exports.deleteTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndRemove(taskId);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Edit the title or completion of a specific task by ID
exports.updateTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const taskData = req.body;
    const task = await Task.findByIdAndUpdate(taskId, taskData, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'There is no task at that id' });
    }
    res.status(204).end();
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Bulk add tasks
exports.bulkAddTasks = async (req, res) => {
  try {
    const tasksData = req.body.tasks;
    const createdTasks = await Task.create(tasksData);
    const ids = createdTasks.map((task) => ({ id: task._id }));
    res.status(201).json({ tasks: ids });
  } catch (err) {
    console.error('Error bulk adding tasks:', err);
    res.status(500).json({ error: 'Failed to bulk add tasks' });
  }
};

// Bulk delete tasks
exports.bulkDeleteTasks = async (req, res) => {
  try {
    const taskIds = req.body.tasks.map((task) => task.id);
    await Task.deleteMany({ _id: { $in: taskIds } });
    res.status(204).end();
  } catch (err) {
    console.error('Error bulk deleting tasks:', err);
    res.status(500).json({ error: 'Failed to bulk delete tasks' });
  }
};
