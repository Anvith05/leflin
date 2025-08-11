const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Helper to create JWT
const createToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'default_secret_key'; // Fallback for local dev
  return jwt.sign({ id: userId }, secret, { expiresIn: '2h' });
};

// ✅ Signup route
router.post('/signup', async (req, res) => {
  try {
    let {
      fullName, email, password, phone,
      accountType, orgName, address1, address2,
      city, state, postal
    } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'Full name, email, and password are required' });
    }

    email = email.toLowerCase().trim();

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone,
      accountType,
      orgName,
      address1,
      address2,
      city,
      state,
      postal
    });

    await newUser.save();

    // Sign JWT
    const token = createToken(newUser._id);

    // Remove password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;

    return res.status(201).json({ token, user: userObj });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    // Sign JWT
    const token = createToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({ token, user: userObj });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
