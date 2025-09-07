




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
