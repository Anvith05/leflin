const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static frontend files correctly
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB connected');
}).catch(err => {
    console.error('❌ MongoDB connection error:', err);
});

// ✅ API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/donations', require('./routes/donation'));

// ✅ Catch-all for React/HTML routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
