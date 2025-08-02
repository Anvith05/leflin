const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  title: String,
  description: String,
  quantity: Number,
  foodType: String,
  location: String,
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['available', 'requested', 'accepted', 'completed'], default: 'available' },
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', donationSchema);
