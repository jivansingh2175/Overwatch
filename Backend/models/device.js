// // Backend/models/device.js
// client_id: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Client',
//   required: true
// }
// Backend/models/device.js
const mongoose = require('mongoose');

// Check if model already exists to prevent OverwriteModelError
if (mongoose.models.Device) {
  module.exports = mongoose.models.Device;
} else {
  const deviceSchema = new mongoose.Schema({
    device_id: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      default: "Unnamed Device"
    },
    access_key: {
      type: String,
      required: true
    },
    online: {
      type: Boolean,
      default: false
    },
    last_seen: {
      type: Date,
      default: Date.now
    },
    session_pin: {
      type: String,
      default: null
    }
  });

  module.exports = mongoose.model('Device', deviceSchema);
}