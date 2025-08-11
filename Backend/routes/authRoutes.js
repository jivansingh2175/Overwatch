// const express = require('express');
// const router = express.Router();
// const path = require('path');

// // Import controller using consistent path
// const authController = require(path.join(__dirname, '../controllers/authController'));

// // Debugging output
// console.log('=== Debugging authController ===');
// console.log('Imported authController:', authController);
// console.log('Type of signup:', typeof authController?.signup);
// console.log('Type of login:', typeof authController?.login);
// console.log('Available methods:', Object.keys(authController));

// // Route definitions with error handling
// if (typeof authController.signup === 'function') {
//   router.post('/signup', authController.signup);
// } else {
//   console.error('❌ authController.signup is not a function!');
// }

// if (typeof authController.login === 'function') {
//   router.post('/login', authController.login);
// } else {
//   console.error('❌ authController.login is not a function!');
// }

// module.exports = router;


// const express = require('express');
// const router = express.Router();
// const path = require('path');

// // Import controller
// const authController = require(path.join(__dirname, '../controllers/authController'));
// const { auth, verifyAdmin } = require('../../middleware/auth');

// // Debugging
// console.log('=== Debugging authController ===');
// console.log('Imported authController:', authController);
// console.log('Type of signup:', typeof authController?.signup);
// console.log('Type of login:', typeof authController?.login);
// console.log('Available methods:', Object.keys(authController));

// // Signup route
// // Optional: restrict signup to admin only
// // Uncomment below if only admin should create accounts
// // router.post('/signup', auth, verifyAdmin, authController.signup);

// if (typeof authController.clientSignup === 'function') {
//   router.post('/signup', authController.clientSignup);
// } else {
//   console.error('❌ authController.clientSignup is not a function!');
// }


// // Login route
// if (typeof authController.login === 'function') {
//   router.post('/login', authController.login);
// } else {
//   console.error('❌ authController.login is not a function!'); 
// }

// module.exports = router;




// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const authController = require(path.join(__dirname, '../controllers/authController'));
// const { auth, verifySuperadminOrClient } = require('../../middleware/auth');

// // Public signup route - only allows client role
// router.post('/signup', authController.clientSignup);

// // Login route
// router.post('/login', authController.login);

// // Protected route to create any user (superadmin/client/user) — only by superadmin or client
// router.post('/create-user', auth, verifySuperadminOrClient, authController.createUser);

// module.exports = router;





// const express = require('express');
// const router = express.Router();
// const path = require('path');

// // Import controller and middleware
// const authController = require(path.join(__dirname, '../controllers/authController'));
// const { auth, verifyAdmin } = require('../../middleware/auth');

// // Debugging
// console.log('=== Debugging authController ===');
// console.log('Imported authController:', authController);
// console.log('Available methods:', Object.keys(authController));

// // ✅ Public signup for client
// if (typeof authController.clientSignup === 'function') {
//   router.post('/signup', authController.clientSignup);
// } else {
//   console.error('❌ authController.clientSignup is not a function!');
// }

// // ✅ Public login
// if (typeof authController.login === 'function') {
//   router.post('/login', authController.login);
// } else {
//   console.error('❌ authController.login is not a function!');
// }

// // ✅ Authenticated route to create client or user (used by client/superadmin)
// if (typeof authController.createUser === 'function') {
//   router.post('/create-user', auth, authController.createUser);
// } else {
//   console.error('❌ authController.createUser is not a function!');
// }

// module.exports = router;






const express = require('express');
const router = express.Router();
const path = require('path');

const authController = require(path.join(__dirname, '../controllers/authController'));
const { auth, verifySuperadminOrClient } = require('../../middleware/auth');

console.log('=== Debugging authController ===');
console.log('Imported authController:', authController);
console.log('Available methods:', Object.keys(authController));

// ✅ Public signup (only for clients)
router.post('/signup', authController.clientSignup);

// ✅ Public login
router.post('/login', authController.login);

// ✅ Authenticated route to create clients or users (allowed for superadmin or client)
router.post('/create-user', auth, verifySuperadminOrClient, authController.createUser);

// ✅ Authenticated route to get current user details
router.get('/me', auth, (req, res) => {
  res.status(200).json({ user: req.user });
});

module.exports = router;
