// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, default: 'user' }, // 'admin' or 'user'
// });

// module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
//   role: { type: String, enum: ['admin', 'client', 'user'], default: 'user' },
//   clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // for client-user hierarchy
// });

// module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: { 
//     type: String, 
//     unique: true, 
//     required: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: { 
//     type: String, 
//     enum: ['admin', 'client', 'user'], 
//     default: 'user' 
//   },
//   // ⬇️ Only applicable when role is 'user', to link to their client org
//   clientId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User' 
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);





const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    unique: true, 
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
  type: String,
  enum: ['superadmin','client', 'user'], // ✅ fixed
  default: 'user'
},

  // For users under a client organization
  client: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: function() {
      return this.role === 'user';
    }
  },
  // For clients to track their users
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // For all users to track their devices
  devices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device'
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('User', userSchema);