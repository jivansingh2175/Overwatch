// // Backend/sockets/deviceSockets.js
// const Device = require('../../models/device');
// const bcrypt = require('bcryptjs');

// module.exports = (io) => {
//   const connectedDevices = {};
//   const viewers = {};

//   io.on('connection', (socket) => {
//     console.log(`New connection: ${socket.id}`);

//     socket.on('register_device', async ({ device_id, access_key }) => {
//       try {
//         const device = await Device.findOne({ device_id });
//         if (!device) return socket.emit('error', 'Device not registered');
        
//         const validKey = await bcrypt.compare(access_key, device.access_key);
//         if (!validKey) return socket.emit('error', 'Invalid credentials');
        
//         connectedDevices[device_id] = socket.id;
//         socket.join(device_id);
        
//         await Device.updateOne(
//           { _id: device._id },
//           { $set: { online: true, last_seen: new Date() } }
//         );
        
//         socket.emit('device_registered', { device_id });
//       } catch (err) {
//         socket.emit('error', 'Server error');
//         console.error('Registration error:', err);
//       }
//     });

//     // Add other socket event handlers here...
//   });
// };


// const Device = require('../../models/device');
// const bcrypt = require('bcryptjs');

// module.exports = (io) => {
//   const connectedDevices = {};
//   const viewers = {};

//   io.on('connection', (socket) => {
//     console.log(`New connection: ${socket.id}`);

//     // DEVICE REGISTRATION
//     socket.on('register_device', async ({ device_id, access_key }) => {
//       try {
//         const device = await Device.findOne({ device_id });
//         if (!device) return socket.emit('error', 'Device not registered');

//         const validKey = await bcrypt.compare(access_key, device.access_key);
//         if (!validKey) return socket.emit('error', 'Invalid credentials');

//         connectedDevices[device_id] = socket.id;
//         socket.join(device_id);

//         await Device.updateOne(
//           { _id: device._id },
//           { $set: { online: true, last_seen: new Date() } }
//         );

//         socket.emit('device_registered', { device_id });
//       } catch (err) {
//         socket.emit('error', 'Server error');
//         console.error('Registration error:', err);
//       }
//     });

//     // ADMIN STARTS WATCHING A DEVICE
//     socket.on('watch', (device_id) => {
//       viewers[socket.id] = device_id;
//       socket.join(device_id);
//       console.log(`Viewer ${socket.id} joined ${device_id}`);
//     });

//     // DEVICE STREAMS SCREEN IMAGE DATA
//     socket.on('screen-data', ({ device_id, data }) => {
//       if (!device_id || !data) return;
//       io.to(device_id).emit('screen-data', { data });
//     });

//     // CLEANUP ON DISCONNECT
//     socket.on('disconnect', async () => {
//       const viewerDevice = viewers[socket.id];
//       if (viewerDevice) {
//         delete viewers[socket.id];
//         socket.leave(viewerDevice);
//       }

//       const deviceId = Object.keys(connectedDevices).find(
//         (key) => connectedDevices[key] === socket.id
//       );
//       if (deviceId) {
//         delete connectedDevices[deviceId];
//         socket.leave(deviceId);
//         await Device.updateOne(
//           { device_id: deviceId },
//           { $set: { online: false, last_seen: new Date() } }
//         );
//       }

//       console.log(`Disconnected: ${socket.id}`);
//     });
//   });
// };



// Backend/sockets/deviceSockets.js
const viewers = {};

const setupDeviceSockets = (io) => {
  io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('watch', (device_id) => {
      viewers[socket.id] = device_id;
      socket.join(device_id);
      console.log(`Viewer ${socket.id} joined ${device_id}`);
      socket.emit('join_success'); // ✅ Notify frontend it worked
    });

    socket.on('screen-data', (data) => {
      const { device_id, image } = data;
      io.to(device_id).emit('screen-data', { image });
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected: ${socket.id}`);
      delete viewers[socket.id];
    });
  });
};

module.exports = setupDeviceSockets;
