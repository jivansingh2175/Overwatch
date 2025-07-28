// Backend/models/device.js
client_id: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Client',
  required: true
}
