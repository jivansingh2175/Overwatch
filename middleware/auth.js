// // const jwt = require('jsonwebtoken');

// // module.exports = function (req, res, next) {
// //   const token = req.header('Authorization');
// //   if (!token) return res.status(401).json({ msg: 'No token, access denied' });

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     next();
// //   } catch (err) {
// //     res.status(400).json({ msg: 'Token is not valid' });
// //   }
// // };


// // const jwt = require('jsonwebtoken');

// // module.exports = function (req, res, next) {
// //   const authHeader = req.header('Authorization');

// //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
// //     return res.status(401).json({ msg: 'No token, access denied' });
// //   }

// //   const token = authHeader.split(' ')[1]; // 👈 Get the token only

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded;
// //     next();
// //   } catch (err) {
// //     res.status(400).json({ msg: 'Token is not valid' });
// //   }
// // };


// // // middlewares/auth.js
// // const jwt = require('jsonwebtoken');

// // const auth = (req, res, next) => {
// //   const token = req.headers.authorization?.split(' ')[1]; // Expecting 'Bearer <token>'

// //   if (!token) {
// //     return res.status(401).json({ msg: 'No token provided' });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded; // Attach user payload to request
// //     next();
// //   } catch (err) {
// //     return res.status(403).json({ msg: 'Invalid or expired token' });
// //   }
// // };

// // module.exports = auth;


// // const jwt = require('jsonwebtoken');

// // module.exports = function (req, res, next) {
// //   const token = req.header('Authorization')?.split(' ')[1]; // ✅ Extract Bearer token

// //   if (!token) {
// //     return res.status(401).json({ msg: 'No token, authorization denied' });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded.user;
// //     next();
// //   } catch (err) {
// //     res.status(401).json({ msg: 'Token is not valid' });
// //   }
// // };




// // // middleware/auth.js
// // const jwt = require('jsonwebtoken');

// // // Middleware factory for optional role-based access
// // function auth(requiredRole = null) {
// //   return function (req, res, next) {
// //     const authHeader = req.header('Authorization');

// //     if (!authHeader) {
// //       return res.status(401).json({ msg: 'No token, authorization denied' });
// //     }

// //     const token = authHeader.split(' ')[1]; // Extract Bearer token

// //     if (!token) {
// //       return res.status(401).json({ msg: 'No token, authorization denied' });
// //     }

// //     try {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = decoded.user; // Contains id and role from token

// //       if (requiredRole && decoded.user.role !== requiredRole) {
// //         return res.status(403).json({ msg: 'Access denied: Insufficient role' });
// //       }

// //       next(); // Proceed to route
// //     } catch (err) {
// //       console.error('JWT error:', err.message);
// //       res.status(401).json({ msg: 'Token is not valid' });
// //     }
// //   };
// // }

// // module.exports = auth;



// // // middleware/auth.js
// // const jwt = require('jsonwebtoken');

// // // Main middleware factory — supports role-based auth
// // function auth(requiredRole = null) {
// //   return function (req, res, next) {
// //     const authHeader = req.header('Authorization');

// //     if (!authHeader) {
// //       return res.status(401).json({ msg: 'No token, authorization denied' });
// //     }

// //     const token = authHeader.split(' ')[1]; // Extract Bearer token

// //     if (!token) {
// //       return res.status(401).json({ msg: 'No token, authorization denied' });
// //     }

// //     try {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = decoded.user; // { id, role }

// //       if (requiredRole && decoded.user.role !== requiredRole) {
// //         return res.status(403).json({ msg: 'Access denied: Insufficient role' });
// //       }

// //       next();
// //     } catch (err) {
// //       console.error('JWT error:', err.message);
// //       res.status(401).json({ msg: 'Token is not valid' });
// //     }
// //   };
// // }

// // // Separate middleware to enforce "client" role
// // const verifyClient = auth('client');

// // // Export both
// // module.exports = auth;
// // module.exports.verifyClient = verifyClient;


// // // middleware/auth.js
// // const jwt = require('jsonwebtoken');

// // // Middleware factory for optional role-based access
// // function auth(requiredRole = null) {
// //   return function (req, res, next) {
// //     const authHeader = req.header('Authorization');

// //     if (!authHeader) {
// //       return res.status(401).json({ msg: 'No token, authorization denied' });
// //     }

// //     const token = authHeader.split(' ')[1]; // Extract Bearer token

// //     if (!token) {
// //       return res.status(401).json({ msg: 'No token, authorization denied' });
// //     }

// //     try {
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       req.user = decoded.user; // Contains id and role from token

// //       if (requiredRole && decoded.user.role !== requiredRole) {
// //         return res.status(403).json({ msg: 'Access denied: Insufficient role' });
// //       }

// //       next(); // Proceed to route
// //     } catch (err) {
// //       console.error('JWT error:', err.message);
// //       res.status(401).json({ msg: 'Token is not valid' });
// //     }
// //   };
// // }

// // // ✅ Specific middleware for verifying "client" role
// // const verifyClient = auth("client");

// // // ✅ You can also create verifyAdmin, verifyTechnician similarly if needed

// // module.exports = auth;
// // module.exports.verifyClient = verifyClient;



// // // middleware/auth.js
// // const jwt = require('jsonwebtoken');
// // const SECRET = process.env.JWT_SECRET || 'secret123';

// // // ✅ Base middleware to verify any token
// // const auth = (req, res, next) => {
// //   const token = req.headers.authorization?.split(' ')[1]; // Bearer token
// //   if (!token) return res.status(401).json({ message: 'No token provided' });

// //   try {
// //     const decoded = jwt.verify(token, SECRET);
// //     req.user = decoded; // Add decoded info to request
// //     next();
// //   } catch (err) {
// //     return res.status(401).json({ message: 'Invalid token' });
// //   }
// // };

// // // ✅ Only clients (not admins) allowed
// // const verifyClient = (req, res, next) => {
// //   console.log("User Role Check:", req.user);  // 👈 add this
// //   if (req.user?.role !== 'client') {
// //     return res.status(403).json({ message: 'Access denied. Clients only.' });
// //   }
// //   next();
// // };


// // // ✅ Only admins allowed
// // const verifyAdmin = (req, res, next) => {
// //   if (req.user?.role !== 'admin') {
// //     return res.status(403).json({ message: 'Access denied. Admins only.' });
// //   }
// //   next();
// // };

// // module.exports = {
// //   auth,
// //   verifyClient,
// //   verifyAdmin
// // };


// // middleware/auth.js
// const jwt = require('jsonwebtoken');
// const SECRET = process.env.JWT_SECRET || 'secret123';

// // ✅ Verify token and extract user info
// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, SECRET);
//     req.user = decoded; // Attach decoded user to request
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // ✅ Admins only (superadmin-level access)
// const verifyAdmin = (req, res, next) => {
//   if (req.user?.role !== 'admin') {
//     return res.status(403).json({ message: 'Access denied. Admins only.' });
//   }
//   next();
// };

// // ✅ Clients only
// const verifyClient = (req, res, next) => {
//   if (req.user?.role !== 'client') {
//     return res.status(403).json({ message: 'Access denied. Clients only.' });
//   }
//   next();
// };

// // ✅ Regular Users only
// const verifyUser = (req, res, next) => {
//   if (req.user?.role !== 'user') {
//     return res.status(403).json({ message: 'Access denied. Users only.' });
//   }
//   next();
// };

// // ✅ Allow Admin OR Client (for shared views or dashboards)
// const verifyAdminOrClient = (req, res, next) => {
//   if (req.user?.role === 'admin' || req.user?.role === 'client') {
//     return next();
//   }
//   return res.status(403).json({ message: 'Access denied. Admin or Client only.' });
// };

// module.exports = {
//   auth,
//   verifyAdmin,
//   verifyClient,
//   verifyUser,
//   verifyAdminOrClient
// };




// const jwt = require('jsonwebtoken');
// const SECRET = process.env.JWT_SECRET || 'secret123';

// const auth = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const decoded = jwt.verify(token, SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };

// // Admin verification
// const verifyAdmin = (req, res, next) => {
//   if (req.user?.role !== 'admin') {
//     return res.status(403).json({ message: 'Admin access required' });
//   }
//   next();
// };

// // Client verification
// const verifyClient = (req, res, next) => {
//   if (req.user?.role !== 'client') {
//     return res.status(403).json({ message: 'Client access required' });
//   }
//   next();
// };

// const verifyUser = (req, res, next) => {
//   if (req.user?.role !== 'user') {
//     return res.status(403).json({ message: 'Access denied. Users only.' });
//   }
//   next();
// };

// // Middleware to verify device ownership
// const verifyDeviceAccess = async (req, res, next) => {
//   try {
//     const deviceId = req.params.id || req.body.deviceId;
//     const device = await Device.findById(deviceId);
    
//     if (!device) {
//       return res.status(404).json({ message: 'Device not found' });
//     }

//     // Superadmin has access to all devices
//     if (req.user.role === 'superadmin') return next();
    
//     // Client has access to their organization's devices
//     if (req.user.role === 'client' && device.client.equals(req.user._id)) {
//       return next();
//     }
    
//     // User has access only to their assigned devices
//     if (req.user.role === 'user' && device.assigned_to.equals(req.user._id)) {
//       return next();
//     }

//     return res.status(403).json({ message: 'Access denied to this device' });
//   } catch (err) {
//     return res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = {
//   auth,
//   verifySuperadmin,
//   verifyClient,
//   verifyUser,
//   verifyDeviceAccess
// };



// auth.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret123';

// Base authentication middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin verification
const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Client verification
const verifyClient = (req, res, next) => {
  if (req.user?.role !== 'client') {
    return res.status(403).json({ message: 'Client access required' });
  }
  next();
};

// Device access verification
const verifyDeviceAccess = async (req, res, next) => {
  try {
    const device = await Device.findById(req.params.id);
    if (!device) return res.status(404).json({ message: 'Device not found' });

    // Admin has access to all devices
    if (req.user.role === 'admin') return next();
    
    // Client has access to their devices
    if (req.user.role === 'client' && device.client.equals(req.user._id)) {
      return next();
    }

    // User has access to assigned devices
    if (req.user.role === 'user' && device.assigned_to.equals(req.user._id)) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  auth,
  verifyAdmin,
  verifyClient,
  verifyDeviceAccess
};