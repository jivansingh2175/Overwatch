const express = require('express');
const router = express.Router();
const path = require('path');

// Import controller using consistent path
const authController = require(path.join(__dirname, '../controllers/authController'));

// Debugging output
console.log('=== Debugging authController ===');
console.log('Imported authController:', authController);
console.log('Type of signup:', typeof authController?.signup);
console.log('Type of login:', typeof authController?.login);
console.log('Available methods:', Object.keys(authController));

// Route definitions with error handling
if (typeof authController.signup === 'function') {
  router.post('/signup', authController.signup);
} else {
  console.error('❌ authController.signup is not a function!');
}

if (typeof authController.login === 'function') {
  router.post('/login', authController.login);
} else {
  console.error('❌ authController.login is not a function!');
}

module.exports = router;