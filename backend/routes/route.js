const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');

// POST /api/donations — Donor posts a donation
router.post('/', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/donations — NGO gets all available donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'available' });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/donations/:id/request — NGO requests a donation
router.patch('/:id/request', async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: 'requested', requestedBy: req.body.ngoId },
      { new: true }
    );
    res.json(donation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
