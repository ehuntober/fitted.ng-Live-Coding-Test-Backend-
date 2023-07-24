
// const userAuthorizationMiddleware = (req, res, next) => {
//   // Check if the user is an ordinary user (role is 'Regular User')
//   console.log('User role:', req.user.role);
//   if (req.user.role === 'Regular User') {
//     // Ordinary users can only access GET and PUT routes for their assigned tasks
//     if (req.method === 'GET' || req.method === 'PUT') {
//       // Check if the task ID in the request params is assigned to the user
//       const taskId = req.params.id || req.body.id;
//       console.log('Assigned Task IDs:', req.user.assignedTasks);
//       const assignedTaskIds = req.user.assignedTasks.map((task) => task.toString());
//       console.log('Assigned Task IDs:', assignedTaskIds);
//       if (assignedTaskIds.includes(taskId)) {
//         return next();
//       }
//     }
//     return res.status(403).json({ error: 'Access denied' });
//   }
//   // Super Admin can access all routes, so no restriction
//   next();
// };

// module.exports = userAuthorizationMiddleware;
