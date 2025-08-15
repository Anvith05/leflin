const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Donation = require('../models/donation');

const router = express.Router();

// Simple authentication middleware
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
}

// Create a new donation (requires login)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const donation = new Donation({
      ...req.body,
      donorId: req.user._id // Link donation to logged-in user
    });
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all donations (public)
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find();
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get logged-in user's donations
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const donations = await Donation.find({ donorId: req.user._id });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Request a donation (for NGOs)
router.patch('/:id/request', authMiddleware, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    if (donation.status !== 'available') {
      return res.status(400).json({ message: 'Donation is not available' });
    }
    
    donation.status = 'requested';
    donation.requestedBy = req.user._id;
    await donation.save();
    
    res.json({ message: 'Donation request successful', donation });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
