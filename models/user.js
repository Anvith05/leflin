const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    accountType: { type: String, enum: ['donor', 'ngo'], required: true },
    orgName: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    postal: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
