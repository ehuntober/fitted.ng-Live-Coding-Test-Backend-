require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
const Task = require('../models/task'); // Add this line to import the Task model

// const authMiddleware = async (req, res, next) => {
//   try {
//     // Check if the request contains a valid JWT token
//     const token = req.header('Authorization').replace('Bearer ', '');
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }

//     // Verify the JWT token and extract the payload
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // Find the user based on the decoded userId from the JWT token
//     const user = await User.findById(decoded.userId);

//     if (!user) {
//       return res.status(401).json({ error: 'Authentication failed' });
//     }

//     // Attach the user object to the request for further use
//     req.user = user;
//     next();
//   } catch (err) {
//     console.error('Error verifying JWT token:', err);
//     res.status(500).json({ error: 'Authentication failed' });
//   }
// };

// module.exports = authMiddleware;






const authMiddleware = async (req, res, next) => {
  try {
    // Check if the request contains a valid JWT token
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Verify the JWT token and extract the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded userId from the JWT token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Attach the user object to the request for further use
    req.user = user;

    // Find the task IDs assigned to the user and populate the assignedTasks field
    const assignedTasks = await Task.find({ assignedUser: user._id }).select('_id');

    // Attach the assignedTasks array to the user object
    req.user.assignedTasks = assignedTasks.map(task => task._id);

    next();
  } catch (err) {
    console.error('Error verifying JWT token:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
