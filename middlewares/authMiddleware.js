require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user');

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
    next();
  } catch (err) {
    console.error('Error verifying JWT token:', err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;

