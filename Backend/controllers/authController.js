// // const User = require('../../models/user');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');

// // module.exports = {
// //   signup: async (req, res) => {
// //     try {
// //       const { name, email, password, role } = req.body;
      
// //       if (await User.findOne({ email })) {
// //         return res.status(400).json({ error: 'Email already exists' });
// //       }

// //       const user = await User.create({
// //         name,
// //         email,
// //         password: await bcrypt.hash(password, 12),
// //         role: role || 'user'
// //       });

// //       res.status(201).json({
// //         message: 'User created',
// //         user: { id: user._id, name: user.name, email: user.email }
// //       });
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   },

// //   login: async (req, res) => {
// //     try {
// //       const { email, password } = req.body;
// //       const user = await User.findOne({ email });
      
// //       if (!user || !(await bcrypt.compare(password, user.password))) {
// //         return res.status(401).json({ error: 'Invalid credentials' });
// //       }

// //       const token = jwt.sign(
// //         { id: user._id, role: user.role },
// //         process.env.JWT_SECRET,
// //         { expiresIn: '1d' }
// //       );

// //       res.json({
// //         token,
// //         user: { id: user._id, name: user.name, email: user.email, role: user.role }
// //       });
// //     } catch (err) {
// //       res.status(500).json({ error: err.message });
// //     }
// //   }
// // };





// const User = require('../../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// module.exports = {
//   signup: async (req, res) => {
//     try {
//       const { name, email, password, role, clientId } = req.body;
      
//       // Only superadmin can create other superadmins or clients
//       if (['superadmin', 'client'].includes(role) && req.user?.role !== 'superadmin') {
//         return res.status(403).json({ error: 'Unauthorized role assignment' });
//       }

//       // Clients can only create users for their organization
//       if (req.user?.role === 'client' && role !== 'user') {
//         return res.status(403).json({ error: 'Clients can only create users' });
//       }

//       if (req.user?.role === 'client') {
//         req.body.clientId = req.user._id;
//       }

//       if (await User.findOne({ email })) {
//         return res.status(400).json({ error: 'Email already exists' });
//       }

//       const user = await User.create({
//         name,
//         email,
//         password: await bcrypt.hash(password, 12),
//         role: role || 'user',
//         client: clientId || (role === 'user' ? req.user?._id : undefined)
//       });

//       // If created by a client, add to client's users array
//       if (req.user?.role === 'client') {
//         await User.findByIdAndUpdate(req.user._id, {
//           $addToSet: { users: user._id }
//         });
//       }

//       res.status(201).json({
//         message: 'User created',
//         user: { 
//           id: user._id, 
//           name: user.name, 
//           email: user.email,
//           role: user.role,
//           client: user.client
//         }
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email });
      
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }

//       const token = jwt.sign(
//         { 
//           id: user._id, 
//           role: user.role,
//           client: user.client 
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '1d' }
//       );

//       res.json({
//         token,
//         user: { 
//           id: user._id, 
//           name: user.name, 
//           email: user.email, 
//           role: user.role,
//           client: user.client
//         }
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// };



// const User = require('../../models/user');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// module.exports = {
//   signup: async (req, res) => {
//     try {
//       const { name, email, password, role = 'user', clientId } = req.body;

//       // Prevent direct signup as superadmin by anyone
//       if (role === 'superadmin') {
//         return res.status(403).json({ error: 'Cannot signup as superadmin' });
//       }

//       // If role is client, only allow if no req.user OR req.user is superadmin
//       if (role === 'client' && req.user && req.user.role !== 'superadmin') {
//         return res.status(403).json({ error: 'Only superadmin can create clients' });
//       }

//       // Clients cannot create other clients/users directly unless allowed
//       if (req.user?.role === 'client' && role !== 'user') {
//         return res.status(403).json({ error: 'Clients can only create users' });
//       }

//       if (await User.findOne({ email })) {
//         return res.status(400).json({ error: 'Email already exists' });
//       }

//       const user = await User.create({
//         name,
//         email,
//         password: await bcrypt.hash(password, 12),
//         role,
//         client: role === 'user' ? (req.user?._id || clientId) : undefined
//       });

//       // Add created user to client’s user list if created by client
//       if (req.user?.role === 'client') {
//         await User.findByIdAndUpdate(req.user._id, {
//           $addToSet: { users: user._id }
//         });
//       }

//       res.status(201).json({
//         message: 'User created',
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           client: user.client
//         }
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   login: async (req, res) => {
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email });

//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ error: 'Invalid credentials' });
//       }

//       const token = jwt.sign(
//         {
//           id: user._id,
//           role: user.role,
//           client: user.client
//         },
//         process.env.JWT_SECRET,
//         { expiresIn: '1d' }
//       );

//       res.json({
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           role: user.role,
//           client: user.client
//         }
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// };




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
