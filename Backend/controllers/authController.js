


const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret123';

module.exports = {
  // Public signup for clients only
  clientSignup: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (role && role !== 'client') {
        return res.status(403).json({ error: 'Only client role allowed for self-signup' });
      }

      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'client'
      });

      res.status(201).json({ message: 'Client registered successfully', user });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  // Authenticated route: superadmin/client creates user or client
  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      if (!['client', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Only client or user roles allowed here' });
      }

      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role
      });

      if (role === 'user') {
        newUser.client = req.user._id; // user under client
        await newUser.save();

        await User.findByIdAndUpdate(req.user._id, { $push: { users: newUser._id } });
      } else {
        await newUser.save(); // for client creation by superadmin
      }

      res.status(201).json({ message: `${role} created successfully`, user: newUser });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { _id: user._id, role: user.role },
        SECRET,
        { expiresIn: '1d' }
      );

      res.status(200).json({ token, user });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
};
