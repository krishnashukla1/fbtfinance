

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: Generate JWT
const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Signup: Allow one admin, many guests
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if user with same email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Count existing admins
    const adminCount = await User.countDocuments({ role: 'admin' });

    // If role is admin, enforce one-admin rule and require existing admin authorization
    if (role === 'admin') {
      if (adminCount >= 1) {
        return res.status(403).json({ message: 'Only one admin is allowed' });
      }
      // First admin can be created without token
      const user = new User({ name, email, password, role: 'admin' });
      await user.save();
      const token = generateToken(user);
      return res.status(201).json({
        message: 'Admin signup successful',
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
        token,
      });
    }

    // Allow guest signup without restrictions
    const user = new User({ name, email, password, role: 'guest' });
    await user.save();
    const token = generateToken(user);
    res.status(201).json({
      message: 'Guest signup successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Login: Allow both admin and guest login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login };