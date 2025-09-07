

const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret123';

// ✅ Auth middleware
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

 try {
  const decoded = jwt.verify(token, SECRET);
  req.user = decoded;
  next();
} catch (err) {
  const message = err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
  return res.status(401).json({ message });
}
};

// ✅ Role-based middlewares
const verifySuperadmin = (req, res, next) => {
  if (req.user?.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Only superadmin can access this route' });
};

const verifyAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Only admin can access this route' });
};

const verifyClient = (req, res, next) => {
  if (req.user?.role === 'client') {
    return next();
  }
  return res.status(403).json({ message: 'Only client can access this route' });
};

const verifyDeviceAccess = (req, res, next) => {
  if (['client', 'superadmin', 'admin'].includes(req.user?.role)) {
    return next();
  }
  return res.status(403).json({ message: 'No permission to access device' });
};

const verifySuperadminOrClient = (req, res, next) => {
  if (req.user?.role === 'superadmin' || req.user?.role === 'client') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied' });
};

const verifyAdminOrSuperadmin = (req, res, next) => {
  if (req.user?.role === 'admin' || req.user?.role === 'superadmin') {
    return next();
  }
  return res.status(403).json({ message: 'Only admin or superadmin can access this route' });
};

// ✅ Export all
module.exports = {
  auth,
  verifySuperadmin,
  verifyAdmin,
  verifyClient,
  verifyDeviceAccess,
  verifySuperadminOrClient,
  verifyAdminOrSuperadmin
};
