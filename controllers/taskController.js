const Task = require('../models/task');
const User = require('../models/user');
const mongoose = require('mongoose');


// exports.getTaskById = async (req, res) => {
//   const taskId = req.params.id;
//   try {
//     const task = await Task.findById(taskId);
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }
//     if (req.user.role === 'Super Admin' || task.assignedUser === req.user._id) {
//       return res.status(200).json(task);
//     }

//     return res.status(403).json({ error: 'Access denied' });
//   } catch (err) {
//     console.error('Error fetching task by ID:', err);
//     res.status(404).json({ error: "There is no task at that id"
//   });
//   }
// };



// exports.updateTaskById = async (req, res) => {
//   const taskId = req.params.id;
//   const { title, is_completed } = req.body;

//   try {
//     // Find the task by ID
//     const task = await Task.findById(taskId);

//     // If the task is not found, return an error
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     // Check if the user is a Super Admin or if the task is assigned to the user
//     if (req.user.role === 'Super Admin' || task.assignedUser === req.user._id) {
//       // Update the task with the provided data
//       task.title = title;
//       task.is_completed = is_completed;
//       await task.save();

//       return res.status(204).end();
//     }

//     return res.status(403).json({ error: 'Access denied' });
//   } catch (err) {
//     console.error('Error updating task by ID:', err);
//     res.status(404).json({ error: 'There is no task at that id' });
//   }
// };




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
    if (req.user.role === 'Super Admin' || task.assignedUser.toString() === req.user._id.toString()) {
      return res.status(200).json(task);
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error fetching task by ID:', err);
    res.status(500).json({ error: "There is no task at that id" });
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
    if (req.user.role === 'Super Admin' || task.assignedUser.toString() === req.user._id.toString()) {
      // Update the task with the provided data
      task.title = title;
      task.is_completed = is_completed;
      await task.save();

      return res.status(204).end();
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error updating task by ID:', err);
    res.status(404).json({ error: 'There is no task at that id' });
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













// exports.deleteTaskById = async (req, res) => {
//   const taskId = req.params.id;

//   try {
//     // Find the task by ID
//     const task = await Task.findById(taskId);

//     // If the task is not found, return an error
//     if (!task) {
//       return res.status(404).json({ error: 'Task not found' });
//     }

//     // Check if the user is a Super Admin or if the task is assigned to the user
//     if (req.user.role === 'Super Admin' || task.assignedUser === req.user._id) {
//       // Delete the task
//       await Task.findByIdAndDelete(taskId);

//       return res.status(204).end();
//     }

//     return res.status(403).json({ error: 'Access denied' });
//   } catch (err) {
//     console.error('Error deleting task by ID:', err);
//     res.status(500).json({ error: 'Failed to delete task' });
//   }
// };


exports.deleteTaskById = async (req, res) => {
  const taskId = req.params.id;

  // Check if taskId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

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
      await Task.findByIdAndDelete(taskId);

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
    if (req.user.role === 'Super Admin' || tasks.every((task) => task.assignedUser === req.user.username)) {
      // Create an array to store the newly created task IDs
      const taskIds = [];

      // Loop through each task and create it
      for (const taskData of tasks) {
        // Find the user document based on the provided username
        const user = await User.findOne({ username: taskData.assignedUser });

        if (!user) {
          return res.status(404).json({ error: `User with username "${taskData.assignedUser}" not found` });
        }

        // Create the task with the provided data and the ObjectId of the found user
        const task = await Task.create({
          title: taskData.title,
          assignedUser: user._id, // Use the ObjectId of the user
          is_completed: taskData.is_completed,
        });

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
    if (req.user.role === 'Super Admin' || (await areTasksAssignedToUser(tasks, req.user._id))) {
      // Map the task IDs to valid ObjectId instances
      const taskIds = tasks.map(task => task.id);

      // Delete tasks using the "deleteMany" method
      await Task.deleteMany({ _id: { $in: taskIds } });

      return res.status(204).end();
    }

    return res.status(403).json({ error: 'Access denied' });
  } catch (err) {
    console.error('Error bulk deleting tasks:', err);
    res.status(500).json({ error: 'Failed to bulk delete tasks' });
  }
};

// Helper function to check if all tasks are assigned to a specific user
async function areTasksAssignedToUser(tasks, userId) {
  // Get a list of valid task IDs (valid ObjectId strings)
  const validTaskIds = tasks.map(task => {
    try {
      return mongoose.Types.ObjectId(task.id);
    } catch (err) {
      return null; // If invalid, return null
    }
  });

  // Remove any null (invalid) task IDs from the array
  const filteredTaskIds = validTaskIds.filter(taskId => taskId !== null);

  // Find tasks assigned to the user and filter out any invalid task IDs
  const validTasks = await Task.find({ _id: { $in: filteredTaskIds }, assignedUser: userId });

  // Check if all valid tasks are assigned to the user
  return validTasks.length === filteredTaskIds.length;
}



/// Bulk delete 2


// exports.bulkDeleteTasks2 = async (req, res) => {
//   const taskIdsParam = req.query.taskIds;

//   if (!taskIdsParam) {
//     return res.status(400).json({ error: 'taskIds parameter is missing in the query' });
//   }

//   const taskIds = taskIdsParam.split(',');

//   try {
//     // Check if the user is a Super Admin or if the tasks are assigned to the user
//     if (req.user.role === 'Super Admin' || (await areTasksAssignedToUser(taskIds, req.user._id))) {
//       // Map the task IDs to valid ObjectId instances
//       const validTaskIds = taskIds.map(taskId => {
//         try {
//           return mongoose.Types.ObjectId(taskId);
//         } catch (err) {
//           return null; // If invalid, return null
//         }
//       });

//       // Remove any null (invalid) task IDs from the array
//       const filteredTaskIds = validTaskIds.filter(taskId => taskId !== null);

//       // Delete tasks using the "deleteMany" method
//       await Task.deleteMany({ _id: { $in: filteredTaskIds } });

//       return res.status(204).end();
//     }

//     return res.status(403).json({ error: 'Access denied' });
//   } catch (err) {
//     console.error('Error bulk deleting tasks:', err);
//     res.status(500).json({ error: 'Failed to bulk delete tasks' });
//   }
// };

// // Helper function to check if all tasks are assigned to a specific user
// async function areTasksAssignedToUser(taskIds, userId) {
//   // Find tasks assigned to the user and filter out any invalid task IDs
//   const validTasks = await Task.find({ _id: { $in: taskIds }, assignedUser: userId });

//   // Check if all valid tasks are assigned to the user
//   return validTasks.length === taskIds.length;
// }



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




// Endpoint to get tasks assigned to the logged-in user
exports.getTasksAssignedToUser = async (req, res) => {
  const userId = req.user._id; // Assuming you have stored the user ID in the request object after authentication

  try {
    // Fetch tasks assigned to the user using their user ID
    const tasks = await Task.find({ assignedUser: userId });

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error('Error fetching tasks assigned to the user:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};