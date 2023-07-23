require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token, process.env.secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decodedToken;
    next();
  });
};
