const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// ✅ Signup route
router.post('/signup', async (req, res) => {
  const {
    fullName, email, password, phone,
    accountType, orgName, address1, address2,
    city, state, postal
  } = req.body;

  try {
    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Check if email exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      fullName,
      email: normalizedEmail,
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
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Remove password before sending response
    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
});

// ✅ Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Normalize email
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Incorrect password' });

    // Sign JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

    const userObj = user.toObject();
    delete userObj.password;

    res.json({ token, user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

module.exports = router;
