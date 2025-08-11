// Backend/routes/superadmin.js

const express = require('express');
const router = express.Router();
const { auth, verifySuperadmin } = require('../../middleware/auth');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

// ✅ GET all clients and users (Only for Superadmin)
router.get('/clients', auth, verifySuperadmin, async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['client', 'user'] } }).select('-password');
    res.status(200).json({ clients: users }); // ✅ wrap in an object
  } catch (err) {
    console.error('Error fetching clients:', err);
    res.status(500).json({ error: 'Server error while fetching clients' });
  }
});

// ✅ POST: Superadmin creates a new client
router.post('/create-client', auth, verifySuperadmin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Client created successfully', user: newUser });
  } catch (err) {
    console.error('Error creating client:', err);
    res.status(500).json({ error: 'Internal server error while creating client' });
  }
});

module.exports = router;
