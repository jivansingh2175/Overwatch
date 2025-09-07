



const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

const { 
  auth, 
  verifyAdmin, 
  verifyClient,
  verifySuperadmin,
  verifyDeviceAccess,
  verifyAdminOrSuperadmin
} = require('../../middleware/auth');

// Debugging
console.log("=== Debugging deviceController ===");
console.log("Available methods:", Object.keys(deviceController));

// ✅ Define all routes
const routes = [
  {
    path: '/register',
    method: 'post',
    middleware: [auth, verifyClient],
    handler: deviceController.registerDevice
  },
  {
    path: '/status/:id',
    method: 'get',
    middleware: [auth, verifyDeviceAccess],
    handler: deviceController.getStatus
  },
  {
    path: '/all',
    method: 'get',
    middleware: [auth, verifyAdminOrSuperadmin],
    handler: deviceController.getDevices
  },
  {
    path: '/list',
    method: 'get',
    middleware: [auth, verifyClient],
    handler: deviceController.getDevices
  },
  {
    path: '/assign',
    method: 'post',
    middleware: [auth, verifyAdminOrSuperadmin],
    handler: deviceController.assignDevice
  },
  {
    path: '/by-user/:userId',
    method: 'get',
    middleware: [auth],
    handler: deviceController.getDevicesByUser
  }
];

// ✅ Register all routes
routes.forEach(route => {
  if (typeof route.handler !== 'function') {
    console.error(`❌ Missing handler for ${route.method.toUpperCase()} ${route.path}`);
    return;
  }

  router[route.method](route.path, ...route.middleware, route.handler);
  console.log(`✅ Registered ${route.method.toUpperCase()} ${route.path}`);
});

module.exports = router;
