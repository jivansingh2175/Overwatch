const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  device_id: { type: String, unique: true }, // e.g., LAPTOP-001
  name: String,
  access_key: String, // hashed version of the key
  registered_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  last_seen: Date,
  online: { type: Boolean, default: false }
});

module.exports = mongoose.model('Device', deviceSchema);
