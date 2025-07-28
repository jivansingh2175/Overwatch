  // // Backend\routes\deviceRoutes.js
  // const express = require('express');
  // const router = express.Router();
  // const deviceController = require('../controllers/deviceController.js');

  // console.log("=== Debugging deviceController ===");
  // console.log(deviceController);
  // console.log("Methods:", Object.keys(deviceController));

  // router.post('/register', deviceController.registerDevice);
  // router.get('/status/:id', deviceController.getStatus);
  // router.get('/all', deviceController.getDevices);

  // module.exports = router;

  // console.log(deviceController);
  // console.log("Methods:", Object.keys(deviceController));


  // // Backend\routes\deviceRoutes.js
  // const express = require('express');
  // const router = express.Router();
  // const deviceController = require('../controllers/deviceController.js');

  // const { auth, verifyClient } = require('../../middleware/auth');


  // console.log("=== Debugging deviceController ===");
  // console.log(deviceController);
  // console.log("Methods:", Object.keys(deviceController));

  // // ✅ Protect routes with auth middleware
  // // router.post('/register', auth, deviceController.registerDevice);
  // router.post('/register', auth, verifyClient, deviceController.registerDevice);
  // router.get('/status/:id', auth, deviceController.getStatus);
  // router.get('/all', auth, deviceController.getDevices);
  // router.get('/list', auth, deviceController.getDevices);


  // module.exports = router;

  // console.log(deviceController);
  // console.log("Methods:", Object.keys(deviceController));



//   const express = require('express');
// const router = express.Router();
// const deviceController = require('../controllers/deviceController.js');
// const { auth, verifyAdmin, verifyClient } = require('../../middleware/auth');

// // Debugging
// console.log("=== Debugging deviceController ===");
// console.log("Methods:", Object.keys(deviceController));

// // ✅ Only CLIENT can register a device
// router.post('/register', auth, verifyClient, deviceController.registerDevice);

// // ✅ All logged-in users can check status of their own device
// router.get('/status/:id', auth, deviceController.getStatus);

// // ✅ Only ADMIN can view all devices
// router.get('/all', auth, verifyAdmin, deviceController.getDevices);

// // ✅ CLIENT can view only their own devices
// router.get('/list', auth, verifyClient, deviceController.getDevices);

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const deviceController = require('../controllers/deviceController');
// const { 
//   auth, 
//   verifySuperadmin, 
//   verifyClient, 
//   verifyUser,
//   verifyDeviceAccess
// } = require('../../middleware/auth');

// // Debugging
// console.log("=== Debugging deviceController ===");
// console.log("Methods:", Object.keys(deviceController));

// // Device Registration
// router.post(
//   '/register', 
//   auth, 
//   (req, res, next) => {
//     // Superadmin can register for any client, client can only register for themselves
//     if (req.user.role === 'superadmin') {
//       return next();
//     }
//     if (req.user.role === 'client') {
//       req.body.clientId = req.user._id;
//       return next();
//     }
//     return res.status(403).json({ msg: 'Access denied' });
//   },
//   deviceController.registerDevice
// );

// // Device Status
// router.get(
//   '/status/:id', 
//   auth, 
//   verifyDeviceAccess,
//   deviceController.getStatus
// );

// // List all devices (superadmin only)
// router.get(
//   '/all', 
//   auth, 
//   verifySuperadmin,
//   deviceController.getAllDevices
// );

// // List client's devices
// router.get(
//   '/list', 
//   auth, 
//   (req, res, next) => {
//     if (req.user.role === 'superadmin' || req.user.role === 'client') {
//       return next();
//     }
//     return res.status(403).json({ msg: 'Access denied' });
//   },
//   deviceController.getDevices
// );

// // Assign device to user
// router.post(
//   '/assign', 
//   auth, 
//   (req, res, next) => {
//     if (req.user.role === 'superadmin') {
//       return next();
//     }
//     if (req.user.role === 'client') {
//       // Verify client is assigning their own device
//       req.body.clientId = req.user._id;
//       return next();
//     }
//     return res.status(403).json({ msg: 'Access denied' });
//   },
//   deviceController.assignDevice
// );

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const deviceController = require('../controllers/deviceController');
// const { 
//   auth, 
//   verifyAdmin, 
//   verifyClient,
//   verifyDeviceAccess
// } = require('../../middleware/auth');

// // Debugging
// console.log("=== Debugging deviceController ===");
// console.log("Methods:", Object.keys(deviceController));

// // Device Registration
// router.post('/register', 
//   auth, 
//   verifyClient, 
//   deviceController.registerDevice
// );

// // Get Device Status
// router.get('/status/:id', 
//   auth, 
//   verifyDeviceAccess,
//   deviceController.getStatus
// );

// // Get All Devices (Admin only)
// router.get('/all', 
//   auth, 
//   verifyAdmin, 
//   deviceController.getDevices
// );

// // Get Client's Devices
// router.get('/list', 
//   auth, 
//   verifyClient,
//   deviceController.getClientDevices || deviceController.getDevices
// );

// module.exports = router;




const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { 
  auth, 
  verifyAdmin, 
  verifyClient,
  verifySuperadmin,
  verifyDeviceAccess
} = require('../../middleware/auth');

// Debugging with enhanced logging
console.log("=== Debugging deviceController ===");
console.log("Available methods:", Object.keys(deviceController));

// Route definitions with proper validation
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
    middleware: [auth, verifyAdmin || verifySuperadmin],
    handler: deviceController.getDevices
  },
  {
    path: '/list',
    method: 'get',
    middleware: [auth, verifyClient],
    handler: deviceController.getDevices // Using getDevices which already filters by client
  },
  {
    path: '/assign',
    method: 'post',
    middleware: [auth, verifyClient || verifySuperadmin],
    handler: deviceController.assignDevice
  }
];

// Register routes with validation
routes.forEach(route => {
  if (typeof route.handler !== 'function') {
    console.error(`❌ Missing handler for ${route.method.toUpperCase()} ${route.path}`);
    return;
  }
  
  router[route.method](route.path, ...route.middleware, route.handler);
  console.log(`✅ Registered ${route.method.toUpperCase()} ${route.path}`);
});

module.exports = router;