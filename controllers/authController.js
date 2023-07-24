require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


exports.signupSuperAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if a user with the given username already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new Super Admin user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: 'Super Admin',
    });

    return res.status(201).json({ message: 'Super Admin registered successfully' });
  } catch (err) {
    console.error('Error creating Super Admin:', err);
    res.status(500).json({ error: 'Failed to create Super Admin' });
  }
};


exports.signupUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user already exists by username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record with the provided username and hashed password
    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'Regular User', // Set the role as 'User' for ordinary users
    });

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('Error signing up:', err);
    res.status(500).json({ error: 'Failed to sign up' });
  }
};


exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });

    // If the user is not found, return an error
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with the user's ID and role as payload
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
};


exports.loginSuperAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the Super Admin user by username
    const superAdmin = await User.findOne({ username });

    // If the user is not found or their role is not Super Admin, return an error
    if (!superAdmin || superAdmin.role !== 'Super Admin') {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, superAdmin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate a JWT token with the user's ID and role as payload
    const token = jwt.sign(
      { userId: superAdmin._id, role: superAdmin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Return the token to the client
    res.status(200).json({ token });
  } catch (err) {
    console.error('Error logging in:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
};


exports.getRegularUsers = async (req, res) => {
  try {
    // Check if the user is a Super Admin
    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Fetch all Ordinary users and their user IDs from the database
    const ordinaryUsers = await User.find({ role: 'Regular User' }).select('_id username');

    return res.status(200).json({ ordinaryUsers });
  } catch (err) {
    console.error('Error fetching Ordinary users:', err);
    res.status(500).json({ error: 'Failed to fetch Regular User' });
  }
};

exports.getSpecificUserByUsername = async (req, res) => {
  const username = req.params.username;
  try {
    // Check if the user is a Super Admin
    if (req.user.role !== 'Super Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Fetch the specific user and their user ID from the database
    const user = await User.findOne({ username }).select('_id username');

    // If the user is not found, return an error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching specific user:', err);
    res.status(500).json({ error: 'Failed to fetch specific user' });
  }
};




