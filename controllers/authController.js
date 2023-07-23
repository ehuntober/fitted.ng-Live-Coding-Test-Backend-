require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.signupSuperAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
 
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const superAdmin = await User.create({
      username,
      password: hashedPassword,
      role: 'Super Admin', // Set the role as 'Super Admin'
    });

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Error signing up:', err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
};







