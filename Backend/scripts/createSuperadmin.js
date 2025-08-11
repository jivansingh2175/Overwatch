// scripts/createSuperadmin.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../models/user'); // Adjust path if needed

console.log('🧪 Allowed role values in schema:', User.schema.path('role').enumValues);



const DB_NAME = 'overwatch'; // Replace with your DB name
const DB_URI = `mongodb://localhost:27017/${DB_NAME}`;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  createSuperadmin();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const createSuperadmin = async () => {
  try {
    const email = 'admin@example.com';
    const existing = await User.findOne({ email });

    if (existing) {
      console.log('⚠️ Superadmin already exists.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const superadmin = new User({
      name: 'Super Admin',
      email,
      password: hashedPassword,
      role: 'superadmin'
    });

    await superadmin.save();
    console.log('✅ Superadmin created successfully!');
  } catch (error) {
    console.error('❌ Error creating superadmin:', error);
  } finally {
    mongoose.disconnect();
  }
};
