const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  signup: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      
      if (await User.findOne({ email })) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      const user = await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 12),
        role: role || 'user'
      });

      res.status(201).json({
        message: 'User created',
        user: { id: user._id, name: user.name, email: user.email }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};