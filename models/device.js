// const mongoose = require('mongoose');

// const deviceSchema = new mongoose.Schema({
//   device_id: { type: String, unique: true }, // e.g., LAPTOP-001
//   name: String,
//   access_key: String, // hashed version of the key
//   registered_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   last_seen: Date,
//   online: { type: Boolean, default: false }
// });

// module.exports = mongoose.model('Device', deviceSchema);



const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  device_id: { 
    type: String, 
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  access_key: {
    type: String,
    required: true
  },
  registered_by: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  last_seen: Date,
  online: { 
    type: Boolean, 
    default: false 
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Device', deviceSchema);