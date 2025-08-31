// // // Backend/sockets/deviceSockets.js
// // const Device = require('../../models/device');
// // const bcrypt = require('bcryptjs');

// // module.exports = (io) => {
// //   const connectedDevices = {};
// //   const viewers = {};

// //   io.on('connection', (socket) => {
// //     console.log(`New connection: ${socket.id}`);

// //     socket.on('register_device', async ({ device_id, access_key }) => {
// //       try {
// //         const device = await Device.findOne({ device_id });
// //         if (!device) return socket.emit('error', 'Device not registered');
        
// //         const validKey = await bcrypt.compare(access_key, device.access_key);
// //         if (!validKey) return socket.emit('error', 'Invalid credentials');
        
// //         connectedDevices[device_id] = socket.id;
// //         socket.join(device_id);
        
// //         await Device.updateOne(
// //           { _id: device._id },
// //           { $set: { online: true, last_seen: new Date() } }
// //         );
        
// //         socket.emit('device_registered', { device_id });
// //       } catch (err) {
// //         socket.emit('error', 'Server error');
// //         console.error('Registration error:', err);
// //       }
// //     });

// //     // Add other socket event handlers here...
// //   });
// // };


// // const Device = require('../../models/device');
// // const bcrypt = require('bcryptjs');

// // module.exports = (io) => {
// //   const connectedDevices = {};
// //   const viewers = {};

// //   io.on('connection', (socket) => {
// //     console.log(`New connection: ${socket.id}`);

// //     // DEVICE REGISTRATION
// //     socket.on('register_device', async ({ device_id, access_key }) => {
// //       try {
// //         const device = await Device.findOne({ device_id });
// //         if (!device) return socket.emit('error', 'Device not registered');

// //         const validKey = await bcrypt.compare(access_key, device.access_key);
// //         if (!validKey) return socket.emit('error', 'Invalid credentials');

// //         connectedDevices[device_id] = socket.id;
// //         socket.join(device_id);

// //         await Device.updateOne(
// //           { _id: device._id },
// //           { $set: { online: true, last_seen: new Date() } }
// //         );

// //         socket.emit('device_registered', { device_id });
// //       } catch (err) {
// //         socket.emit('error', 'Server error');
// //         console.error('Registration error:', err);
// //       }
// //     });

// //     // ADMIN STARTS WATCHING A DEVICE
// //     socket.on('watch', (device_id) => {
// //       viewers[socket.id] = device_id;
// //       socket.join(device_id);
// //       console.log(`Viewer ${socket.id} joined ${device_id}`);
// //     });

// //     // DEVICE STREAMS SCREEN IMAGE DATA
// //     socket.on('screen-data', ({ device_id, data }) => {
// //       if (!device_id || !data) return;
// //       io.to(device_id).emit('screen-data', { data });
// //     });

// //     // CLEANUP ON DISCONNECT
// //     socket.on('disconnect', async () => {
// //       const viewerDevice = viewers[socket.id];
// //       if (viewerDevice) {
// //         delete viewers[socket.id];
// //         socket.leave(viewerDevice);
// //       }

// //       const deviceId = Object.keys(connectedDevices).find(
// //         (key) => connectedDevices[key] === socket.id
// //       );
// //       if (deviceId) {
// //         delete connectedDevices[deviceId];
// //         socket.leave(deviceId);
// //         await Device.updateOne(
// //           { device_id: deviceId },
// //           { $set: { online: false, last_seen: new Date() } }
// //         );
// //       }

// //       console.log(`Disconnected: ${socket.id}`);
// //     });
// //   });
// // };



// // Backend/sockets/deviceSockets.js
// const viewers = {};

// const setupDeviceSockets = (io) => {
//   io.on('connection', (socket) => {
//     console.log(`New connection: ${socket.id}`);

//     socket.on('watch', (device_id) => {
//       viewers[socket.id] = device_id;
//       socket.join(device_id);
//       console.log(`Viewer ${socket.id} joined ${device_id}`);
//       socket.emit('join_success'); // ✅ Notify frontend it worked
//     });

//     socket.on('screen-data', (data) => {
//       const { device_id, image } = data;
//       io.to(device_id).emit('screen-data', { image });
//     });

//     socket.on('disconnect', () => {
//       console.log(`Disconnected: ${socket.id}`);
//       delete viewers[socket.id];
//     });
//   });
// };

// module.exports = setupDeviceSockets;




// const Device = require('../../models/device');
// const connectedDevices = {};
// const viewers = {};

// const setupDeviceSockets = (io) => {
//   io.on('connection', (socket) => {
//     console.log(`New connection: ${socket.id}`);

//     // Device registration and authentication
//     socket.on('register_device', async ({ device_id, access_key }) => {
//       try {
//         const device = await Device.findOne({ device_id });
        
//         if (!device) {
//           return socket.emit('error', 'Device not registered');
//         }
        
//         const validKey = await bcrypt.compare(access_key, device.access_key);
//         if (!validKey) {
//           return socket.emit('error', 'Invalid credentials');
//         }
        
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

//     // Viewer wants to watch a device
//     socket.on('watch', async (device_id) => {
//       try {
//         // In a real app, you would verify the viewer has permission here
//         viewers[socket.id] = device_id;
//         socket.join(device_id);
//         console.log(`Viewer ${socket.id} joined ${device_id}`);
//         socket.emit('join_success');
//       } catch (err) {
//         socket.emit('error', 'Failed to join device');
//       }
//     });

//     // Device sends screen data
//     // Device sends screen data
// socket.on('screen-data', async (data) => {
//   try {
//     const { device_id, image } = data;

//     // Verify the sending device is authenticated
//     if (connectedDevices[device_id] !== socket.id) {
//       return console.warn(`Unauthorized screen data from ${socket.id}`);
//     }

//     // Update last seen timestamp
//     await Device.updateOne(
//       { device_id },
//       { $set: { last_seen: new Date() } }
//     );

//     // Broadcast to all viewers of this device
//     io.to(device_id).emit('screen-data', { device_id, image }); // ✅ include device_id
//   } catch (err) {
//     console.error('Screen data error:', err);
//   }
// });

//     // socket.on('screen-data', async (data) => {
//     //   try {
//     //     const { device_id, image } = data;
        
//     //     // Verify the sending device is authenticated
//     //     if (connectedDevices[device_id] !== socket.id) {
//     //       return console.warn(`Unauthorized screen data from ${socket.id}`);
//     //     }
        
//     //     // Update last seen timestamp
//     //     await Device.updateOne(
//     //       { device_id },
//     //       { $set: { last_seen: new Date() } }
//     //     );
        
//     //     // Broadcast to all viewers of this device
//     //     io.to(device_id).emit('screen-data', { image });
//     //   } catch (err) {
//     //     console.error('Screen data error:', err);
//     //   }
//     // });

//     // Cleanup on disconnect
//     socket.on('disconnect', async () => {
//       console.log(`Disconnected: ${socket.id}`);
      
//       // Handle viewer disconnection
//       const viewerDevice = viewers[socket.id];
//       if (viewerDevice) {
//         delete viewers[socket.id];
//         socket.leave(viewerDevice);
//       }
      
//       // Handle device disconnection
//       const deviceId = Object.keys(connectedDevices).find(
//         key => connectedDevices[key] === socket.id
//       );
      
//       if (deviceId) {
//         delete connectedDevices[deviceId];
//         socket.leave(deviceId);
        
//         await Device.updateOne(
//           { device_id: deviceId },
//           { $set: { online: false, last_seen: new Date() } }
//         );
        
//         console.log(`Device ${deviceId} disconnected`);
//       }
//     });
//   });
// };

// module.exports = setupDeviceSockets;






// // Backend/sockets/deviceSockets.js
// const Device = require('../../models/device');
// const bcrypt = require('bcryptjs');

// const connectedDevices = {};
// const viewers = {};
// let deviceList = []; // in-memory registered devices

// const setupDeviceSockets = (io) => {
//   io.on('connection', (socket) => {
//     console.log(`🔌 New socket connected: ${socket.id}`);

//     // Device registers itself
//     socket.on('register_device', async ({ device_id, access_key, name }) => {
//       try {
//         const device = await Device.findOne({ device_id });
//         if (!device) {
//           return socket.emit('error', 'Device not registered in DB');
//         }

//         const validKey = await bcrypt.compare(access_key, device.access_key);
//         if (!validKey) {
//           return socket.emit('error', 'Invalid credentials');
//         }

//         connectedDevices[device_id] = socket.id;
//         socket.join(device_id);

//         // Update DB
//         await Device.updateOne(
//           { _id: device._id },
//           { $set: { online: true, last_seen: new Date() } }
//         );

//         // Update device list
//         const existing = deviceList.find((d) => d.device_id === device_id);
//         if (!existing) {
//           deviceList.push({
//             device_id,
//             name: device.name || name || "Unnamed Device",
//             pin: device.pin || null,
//             online: true
//           });
//         } else {
//           existing.online = true;
//         }

//         // Notify all viewers with updated list
//         io.emit('devicesList', deviceList);

//         socket.emit('device_registered', { device_id });
//         console.log(`✅ Device registered: ${device_id}`);
//       } catch (err) {
//         console.error('❌ Registration error:', err);
//         socket.emit('error', 'Server error during registration');
//       }
//     });

//     // Viewer requests device list
//     socket.on('getDevices', () => {
//       socket.emit('devicesList', deviceList);
//     });

//     // Viewer joins by PIN
//     socket.on('joinByPin', async (pin, callback) => {
//       const device = deviceList.find(d => d.pin === pin && d.online);
//       if (device) {
//         viewers[socket.id] = device.device_id;
//         socket.join(device.device_id);
//         console.log(`👀 Viewer ${socket.id} joined via PIN ${pin}`);
//         callback(device);
//       } else {
//         callback(null);
//       }
//     });

//     // Viewer wants to watch by device_id
//     socket.on('watch-device', ({ device_id }) => {
//       viewers[socket.id] = device_id;
//       socket.join(device_id);
//       console.log(`👀 Viewer ${socket.id} watching ${device_id}`);
//       socket.emit('join_success', { device_id });
//     });

//     // Device sends screen data
//     socket.on('screen-data', async ({ device_id, image }) => {
//       if (connectedDevices[device_id] !== socket.id) {
//         return console.warn(`⚠️ Unauthorized screen data from ${socket.id}`);
//       }

//       await Device.updateOne(
//         { device_id },
//         { $set: { last_seen: new Date() } }
//       );

//       io.to(device_id).emit('screenData', { deviceId: device_id, image });
//     });

//     // Disconnect
//     socket.on('disconnect', async () => {
//       console.log(`❌ Disconnected: ${socket.id}`);

//       // Check if it was a viewer
//       const viewedDevice = viewers[socket.id];
//       if (viewedDevice) {
//         delete viewers[socket.id];
//         socket.leave(viewedDevice);
//       }

//       // Check if it was a device
//       const deviceId = Object.keys(connectedDevices).find(
//         (key) => connectedDevices[key] === socket.id
//       );

//       if (deviceId) {
//         delete connectedDevices[deviceId];
//         socket.leave(deviceId);

//         // Update DB and device list
//         await Device.updateOne(
//           { device_id: deviceId },
//           { $set: { online: false, last_seen: new Date() } }
//         );

//         const idx = deviceList.findIndex((d) => d.device_id === deviceId);
//         if (idx !== -1) {
//           deviceList[idx].online = false;
//         }

//         io.emit('devicesList', deviceList);
//         console.log(`📴 Device ${deviceId} disconnected`);
//       }
//     });
//   });
// };

// module.exports = setupDeviceSockets;








// // backend/sockets/deviceSockets.js
// // At the top of deviceSockets.js
// const { v4: uuidv4 } = require('uuid');

// // Store devices in memory (you might want to use Redis for production)
// const devices = new Map();
// const deviceRooms = new Map();

// // Generate a random 6-digit PIN
// const generatePIN = () => Math.floor(100000 + Math.random() * 900000).toString();

// module.exports = (io) => {
//   io.on('connection', (socket) => {
//   console.log('✅ Client connected:', socket.id);
  
//   // Add this debug handler
//   socket.on('debug', (data) => {
//     console.log('DEBUG:', data);
//   });

//     // Handle device registration
//     socket.on('register_device', (data) => {
//       try {
//         const { device_id, name } = data;
        
//         if (!device_id || !name) {
//           socket.emit('error', 'Device ID and name are required');
//           return;
//         }

//         const pin = generatePIN();
        
//         // Store device information
//         devices.set(device_id, {
//           device_id,
//           name,
//           socketId: socket.id,
//           pin,
//           online: true,
//           createdAt: new Date()
//         });

//         // Join the device room
//         socket.join(device_id);
//         deviceRooms.set(device_id, new Set([socket.id]));

//         console.log(`✅ Device registered: ${device_id} with PIN: ${pin}`);
        
//         // Send confirmation to the device
//         socket.emit('device_registered', { 
//           device_id, 
//           pin 
//         });

//         // Broadcast device list update to all clients
//         io.emit('devices:update', Array.from(devices.values()));

//       } catch (error) {
//         console.error('❌ Device registration error:', error);
//         socket.emit('error', 'Failed to register device');
//       }
//     });

//     // Handle screen data from devices
//     // In the screen-data handler, add more logging:
// // In the screen-data handler, change the emit event name
// socket.on('screen-data', (data) => {
//   try {
//     const { device_id, image } = data;
    
//     if (!device_id || !image) {
//       console.log('❌ Invalid screen data received');
//       return;
//     }

//     console.log(`📺 Received screen data for device: ${device_id}, image size: ${image.length} bytes`);
    
//     // Get all sockets in the device room
//     const room = io.sockets.adapter.rooms.get(device_id);
//     if (room) {
//       console.log(`👥 Broadcasting to ${room.size} viewers in room ${device_id}`);
//     } else {
//       console.log(`❌ No viewers in room ${device_id}`);
//     }

//     // ✅ FIX: Change 'screen-update' to 'screen-data' to match client expectation
//     socket.to(device_id).emit('screen-data', { device_id, image });
    
//   } catch (error) {
//     console.error('❌ Screen data error:', error);
//   }
// });
//     // Handle watch requests with access key
//     socket.on('watch-device', (data) => {
//       try {
//         const { device_id, access_key } = data;
        
//         if (!device_id) {
//           socket.emit('error', 'Device ID is required');
//           return;
//         }

//         const device = devices.get(device_id);
        
//         if (!device) {
//           socket.emit('error', 'Device not found');
//           return;
//         }

//         if (!device.online) {
//           socket.emit('error', 'Device is offline');
//           return;
//         }

//         // For now, we'll allow any access key since the original implementation
//         // didn't store access keys. You can implement proper authentication later.
//         socket.join(device_id);
        
//         if (!deviceRooms.has(device_id)) {
//           deviceRooms.set(device_id, new Set());
//         }
//         deviceRooms.get(device_id).add(socket.id);

//         console.log(`👀 Client ${socket.id} started watching device: ${device_id}`);
//         socket.emit('watching-started', { device_id });

//       } catch (error) {
//         console.error('❌ Watch device error:', error);
//         socket.emit('error', 'Failed to watch device');
//       }
//     });

//     // Handle PIN-based connection
//     socket.on('join_with_pin', (data) => {
//       try {
//         const { pin } = data;
        
//         if (!pin) {
//           socket.emit('error', 'PIN is required');
//           return;
//         }

//         // Find device by PIN
//         let targetDevice = null;
//         for (let [deviceId, device] of devices) {
//           if (device.pin === pin) {
//             targetDevice = device;
//             break;
//           }
//         }

//         if (!targetDevice) {
//           socket.emit('error', 'Invalid PIN or device not found');
//           return;
//         }

//         if (!targetDevice.online) {
//           socket.emit('error', 'Device is offline');
//           return;
//         }

//         socket.join(targetDevice.device_id);
        
//         if (!deviceRooms.has(targetDevice.device_id)) {
//           deviceRooms.set(targetDevice.device_id, new Set());
//         }
//         deviceRooms.get(targetDevice.device_id).add(socket.id);

//         console.log(`👀 Client ${socket.id} joined device ${targetDevice.device_id} with PIN`);
//         socket.emit('watching-started', { device_id: targetDevice.device_id });

//       } catch (error) {
//         console.error('❌ PIN join error:', error);
//         socket.emit('error', 'Failed to join with PIN');
//       }
//     });

//     // Handle device list requests
//     socket.on('devices:get', () => {
//       try {
//         const deviceList = Array.from(devices.values());
//         socket.emit('devices:update', deviceList);
//         console.log(`📋 Sent device list to client ${socket.id}`);
//       } catch (error) {
//         console.error('❌ Devices get error:', error);
//         socket.emit('error', 'Failed to get devices');
//       }
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('❌ Client disconnected:', socket.id);
      
//       // Remove device if it was a streaming device
//       let deviceToRemove = null;
//       for (let [deviceId, device] of devices) {
//         if (device.socketId === socket.id) {
//           deviceToRemove = deviceId;
//           break;
//         }
//       }
      
//       if (deviceToRemove) {
//         devices.delete(deviceToRemove);
//         deviceRooms.delete(deviceToRemove);
//         console.log(`🗑️ Removed device: ${deviceToRemove}`);
        
//         // Broadcast updated device list
//         io.emit('devices:update', Array.from(devices.values()));
//       }
      
//       // Remove viewer from all rooms
//       for (let [deviceId, viewers] of deviceRooms) {
//         if (viewers.has(socket.id)) {
//           viewers.delete(socket.id);
//           if (viewers.size === 0) {
//             deviceRooms.delete(deviceId);
//           }
//         }
//       }
//     });

//     // Handle errors
//     socket.on('error', (error) => {
//       console.error('❌ Socket error:', error);
//     });
//   });

//   // Periodic cleanup of offline devices
//   setInterval(() => {
//     const now = new Date();
//     let updated = false;
    
//     for (let [deviceId, device] of devices) {
//       // If device was created more than 24 hours ago, remove it
//       if (now - device.createdAt > 24 * 60 * 60 * 1000) {
//         devices.delete(deviceId);
//         deviceRooms.delete(deviceId);
//         updated = true;
//         console.log(`🧹 Cleaned up old device: ${deviceId}`);
//       }
//     }
    
//     if (updated) {
//       io.emit('devices:update', Array.from(devices.values()));
//     }
//   }, 60 * 60 * 1000); // Run every hour
// };







// // backend/sockets/deviceSockets.js
// const { v4: uuidv4 } = require('uuid');

// // Store devices in memory
// const devices = new Map();
// const deviceRooms = new Map();

// // Generate a random 6-digit PIN
// const generatePIN = () => Math.floor(100000 + Math.random() * 900000).toString();

// module.exports = (io) => {
//   io.on('connection', (socket) => {
//     console.log('✅ Client connected:', socket.id);
    
//     // Debug handler for all socket events
//     socket.onAny((event, data) => {
//       console.log(`📡 Socket event: ${event}`, data ? JSON.stringify(data).substring(0, 100) + '...' : 'No data');
//     });

//     // Handle device registration
//     socket.on('register_device', (data) => {
//       try {
//         const { device_id, name } = data;
        
//         if (!device_id || !name) {
//           socket.emit('error', 'Device ID and name are required');
//           return;
//         }

//         const pin = generatePIN();
        
//         // Store device information
//         devices.set(device_id, {
//           device_id,
//           name,
//           socketId: socket.id,
//           pin,
//           online: true,
//           createdAt: new Date()
//         });

//         // Join the device room
//         socket.join(device_id);
//         deviceRooms.set(device_id, new Set([socket.id]));

//         console.log(`✅ Device registered: ${device_id} with PIN: ${pin}`);
//         console.log(`✅ Device ${device_id} joined room: ${device_id}`);
        
//         // Send confirmation to the device
//         socket.emit('device_registered', { 
//           device_id, 
//           pin 
//         });

//         // Broadcast device list update to all clients
//         io.emit('devices:update', Array.from(devices.values()));

//       } catch (error) {
//         console.error('❌ Device registration error:', error);
//         socket.emit('error', 'Failed to register device');
//       }
//     });

//     // Handle screen data from devices - FIXED EVENT NAME
// // In deviceSockets.js - Ensure proper event handling
// socket.on('screen-data', (data) => {
//   try {
//     const { device_id, image } = data;
    
//     console.log('📺 Received screen data for device:', device_id);
    
//     if (!device_id || !image) {
//       console.log('❌ Invalid screen data received');
//       return;
//     }

//     // Verify the device is registered and online
//     const device = devices.get(device_id);
//     if (!device || !device.online) {
//       console.log(`❌ Device ${device_id} is not online or not registered`);
//       return;
//     }

//     // ✅ Broadcast to ALL viewers in the device room
//     io.to(device_id).emit('screen-data', { device_id, image });
    
//     console.log(`📤 Broadcasted screen data to room: ${device_id}`);
    
//   } catch (error) {
//     console.error('❌ Screen data error:', error);
//   }
// });






// //     socket.on('screen-data', (data) => {
// //   try {
// //     const { device_id, image } = data;
    
// //     console.log('📺 Received screen data for device:', device_id);
// //     console.log('📺 Image data size:', image ? image.length : 'null', 'bytes');
    
// //     if (!device_id || !image) {
// //       console.log('❌ Invalid screen data received');
// //       return;
// //     }

// //     // Verify the device is registered and online
// //     const device = devices.get(device_id);
// //     if (!device || !device.online) {
// //       console.log(`❌ Device ${device_id} is not online or not registered`);
// //       return;
// //     }

// //     // Get all sockets in the device room
// //     const room = io.sockets.adapter.rooms.get(device_id);
// //     if (room) {
// //       console.log(`👥 Broadcasting to ${room.size} viewers in room ${device_id}`);
      
// //       // Broadcast to viewers
// //       socket.to(device_id).emit('screen-data', { device_id, image });
// //     } else {
// //       console.log(`❌ No viewers in room ${device_id}`);
// //     }
    
// //   } catch (error) {
// //     console.error('❌ Screen data error:', error);
// //   }
// // });
//     // Handle watch requests with access key
//     socket.on('watch-device', (data) => {
//       try {
//         const { device_id, access_key } = data;
        
//         if (!device_id) {
//           socket.emit('error', 'Device ID is required');
//           return;
//         }

//         const device = devices.get(device_id);
        
//         if (!device) {
//           socket.emit('error', 'Device not found');
//           return;
//         }

//         if (!device.online) {
//           socket.emit('error', 'Device is offline');
//           return;
//         }

//         // For now, we'll allow any access key since the original implementation
//         // didn't store access keys. You can implement proper authentication later.
//         socket.join(device_id);
        
//         if (!deviceRooms.has(device_id)) {
//           deviceRooms.set(device_id, new Set());
//         }
//         deviceRooms.get(device_id).add(socket.id);

//         console.log(`👀 Client ${socket.id} started watching device: ${device_id}`);
//         console.log(`✅ Viewer ${socket.id} joined room: ${device_id}`);
        
//         socket.emit('watching-started', { device_id });

//         // Notify the device that someone is watching
//         io.to(device.socketId).emit('viewer-connected', { viewerId: socket.id });

//       } catch (error) {
//         console.error('❌ Watch device error:', error);
//         socket.emit('error', 'Failed to watch device');
//       }
//     });

//     // Handle PIN-based connection
//     socket.on('join_with_pin', (data) => {
//       try {
//         const { pin } = data;
        
//         if (!pin) {
//           socket.emit('error', 'PIN is required');
//           return;
//         }

//         // Find device by PIN
//         let targetDevice = null;
//         for (let [deviceId, device] of devices) {
//           if (device.pin === pin) {
//             targetDevice = device;
//             break;
//           }
//         }

//         if (!targetDevice) {
//           socket.emit('error', 'Invalid PIN or device not found');
//           return;
//         }

//         if (!targetDevice.online) {
//           socket.emit('error', 'Device is offline');
//           return;
//         }

//         socket.join(targetDevice.device_id);
        
//         if (!deviceRooms.has(targetDevice.device_id)) {
//           deviceRooms.set(targetDevice.device_id, new Set());
//         }
//         deviceRooms.get(targetDevice.device_id).add(socket.id);

//         console.log(`👀 Client ${socket.id} joined device ${targetDevice.device_id} with PIN`);
//         console.log(`✅ Viewer ${socket.id} joined room: ${targetDevice.device_id}`);
        
//         socket.emit('watching-started', { device_id: targetDevice.device_id });

//         // Notify the device that someone is watching
//         io.to(targetDevice.socketId).emit('viewer-connected', { viewerId: socket.id });

//       } catch (error) {
//         console.error('❌ PIN join error:', error);
//         socket.emit('error', 'Failed to join with PIN');
//       }
//     });

//     // Handle device list requests
//     socket.on('devices:get', () => {
//       try {
//         const deviceList = Array.from(devices.values());
//         socket.emit('devices:update', deviceList);
//         console.log(`📋 Sent device list to client ${socket.id}`);
//       } catch (error) {
//         console.error('❌ Devices get error:', error);
//         socket.emit('error', 'Failed to get devices');
//       }
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//       console.log('❌ Client disconnected:', socket.id);
      
//       // Remove device if it was a streaming device
//       let deviceToRemove = null;
//       for (let [deviceId, device] of devices) {
//         if (device.socketId === socket.id) {
//           deviceToRemove = deviceId;
//           break;
//         }
//       }
      
//       if (deviceToRemove) {
//         devices.delete(deviceToRemove);
//         deviceRooms.delete(deviceToRemove);
//         console.log(`🗑️ Removed device: ${deviceToRemove}`);
        
//         // Broadcast updated device list
//         io.emit('devices:update', Array.from(devices.values()));
//       }
      
//       // Remove viewer from all rooms
//       for (let [deviceId, viewers] of deviceRooms) {
//         if (viewers.has(socket.id)) {
//           viewers.delete(socket.id);
//           console.log(`❌ Viewer ${socket.id} left room: ${deviceId}`);
          
//           if (viewers.size === 0) {
//             deviceRooms.delete(deviceId);
//           }
//         }
//       }
//     });

//     // Handle errors
//     socket.on('error', (error) => {
//       console.error('❌ Socket error:', error);
//     });
//   });

//   // Periodic cleanup of offline devices
//   setInterval(() => {
//     const now = new Date();
//     let updated = false;
    
//     for (let [deviceId, device] of devices) {
//       // If device was created more than 24 hours ago, remove it
//       if (now - device.createdAt > 24 * 60 * 60 * 1000) {
//         devices.delete(deviceId);
//         deviceRooms.delete(deviceId);
//         updated = true;
//         console.log(`🧹 Cleaned up old device: ${deviceId}`);
//       }
//     }
    
//     if (updated) {
//       io.emit('devices:update', Array.from(devices.values()));
//     }
//   }, 60 * 60 * 1000); // Run every hour

//   // Debug function to list all rooms and devices
//   const debugRooms = () => {
//     console.log('\n=== SOCKET DEBUG INFO ===');
//     console.log('Active devices:', Array.from(devices.keys()));
//     console.log('Device rooms:', Array.from(deviceRooms.keys()));
    
//     for (let [deviceId, viewers] of deviceRooms) {
//       console.log(`Room ${deviceId}: ${viewers.size} viewers`);
//     }
//     console.log('=========================\n');
//   };

//   // Run debug every 30 seconds
//   setInterval(debugRooms, 30000);
// };




// backend/sockets/deviceSockets.js
const { v4: uuidv4 } = require('uuid');

// Store devices in memory
const devices = new Map();
const deviceRooms = new Map();

// Generate a random 6-digit PIN
const generatePIN = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports = (io) => {
  console.log('🔧 DeviceSockets initialized');
  
  // Debug function to log current state
  const debugState = () => {
    console.log('\n=== SOCKET STATE DEBUG ===');
    console.log('Total devices:', devices.size);
    console.log('Total device rooms:', deviceRooms.size);
    
    devices.forEach((device, id) => {
      console.log(`📱 Device: ${id}, Name: ${device.name}, PIN: ${device.pin}, Online: ${device.online}, Socket: ${device.socketId}`);
    });
    
    deviceRooms.forEach((viewers, roomId) => {
      console.log(`👥 Room ${roomId}: ${viewers.size} viewers`);
    });
    
    if (io.sockets) {
      console.log(`🔌 Total connected sockets: ${io.sockets.sockets.size}`);
    }
    console.log('==========================\n');
  };

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);
    
    // Log all socket events for debugging
    socket.onAny((event, data) => {
      console.log(`📡 Socket event [${socket.id}]: ${event}`, 
        data ? JSON.stringify(data).substring(0, 100) + '...' : 'No data');
    });

    // Handle device registration
    socket.on('register_device', (data) => {
      try {
        const { device_id, name } = data;
        
        console.log('📋 Registering device:', device_id, 'with name:', name);
        
        if (!device_id || !name) {
          console.log('❌ Missing device_id or name');
          socket.emit('error', 'Device ID and name are required');
          return;
        }

        // Check if device already exists
        if (devices.has(device_id)) {
          const existingDevice = devices.get(device_id);
          console.log('⚠️ Device already exists, updating:', device_id);
          
          // Update existing device
          existingDevice.socketId = socket.id;
          existingDevice.online = true;
          existingDevice.lastSeen = new Date();
          
          devices.set(device_id, existingDevice);
        } else {
          // Create new device
          const pin = generatePIN();
          
          devices.set(device_id, {
            device_id,
            name,
            socketId: socket.id,
            pin,
            online: true,
            createdAt: new Date(),
            lastSeen: new Date()
          });

          console.log(`✅ New device registered: ${device_id} with PIN: ${pin}`);
        }

        const device = devices.get(device_id);
        
        // Join the device room
        socket.join(device_id);
        if (!deviceRooms.has(device_id)) {
          deviceRooms.set(device_id, new Set());
        }
        deviceRooms.get(device_id).add(socket.id);

        console.log(`✅ Device ${device_id} joined room: ${device_id}`);
        
        // Send confirmation to the device
        socket.emit('device_registered', { 
          device_id, 
          pin: device.pin 
        });

        // Broadcast device list update to all clients
        const deviceList = Array.from(devices.values()).filter(d => d.online);
        io.emit('devices:update', deviceList);
        console.log(`📤 Broadcasted device list with ${deviceList.length} online devices`);

        debugState();

      } catch (error) {
        console.error('❌ Device registration error:', error);
        socket.emit('error', 'Failed to register device');
      }
    });

    // Handle screen data from devices
    socket.on('screen-data', (data) => {
      try {
        const { device_id, image } = data;
        
        console.log('📺 Received screen data for device:', device_id);
        
        if (!device_id || !image) {
          console.log('❌ Invalid screen data received');
          return;
        }

        // Verify the device is registered and online
        const device = devices.get(device_id);
        if (!device) {
          console.log(`❌ Device ${device_id} not found in registry`);
          return;
        }

        if (!device.online) {
          console.log(`❌ Device ${device_id} is offline`);
          return;
        }

        // Update last seen timestamp
        device.lastSeen = new Date();
        devices.set(device_id, device);

        // Get all sockets in the device room
        const room = io.sockets.adapter.rooms.get(device_id);
        if (room) {
          console.log(`👥 Broadcasting to ${room.size} viewers in room ${device_id}`);
          
          // Broadcast to viewers
          socket.to(device_id).emit('screen-data', { device_id, image });
        } else {
          console.log(`❌ No viewers in room ${device_id}`);
        }
        
      } catch (error) {
        console.error('❌ Screen data error:', error);
      }
    });

    // Handle watch requests with access key
    socket.on('watch-device', (data) => {
      try {
        const { device_id, access_key } = data;
        
        console.log('👀 Watch request for device:', device_id);
        
        if (!device_id) {
          socket.emit('error', 'Device ID is required');
          return;
        }

        const device = devices.get(device_id);
        
        if (!device) {
          console.log('❌ Device not found:', device_id);
          socket.emit('error', 'Device not found');
          return;
        }

        if (!device.online) {
          console.log('❌ Device is offline:', device_id);
          socket.emit('error', 'Device is offline');
          return;
        }

        // For now, allow any access key (you can implement proper auth later)
        socket.join(device_id);
        
        if (!deviceRooms.has(device_id)) {
          deviceRooms.set(device_id, new Set());
        }
        deviceRooms.get(device_id).add(socket.id);

        console.log(`✅ Client ${socket.id} started watching device: ${device_id}`);
        console.log(`✅ Viewer ${socket.id} joined room: ${device_id}`);
        
        socket.emit('watching-started', { device_id });

        // Notify the device that someone is watching
        io.to(device.socketId).emit('viewer-connected', { viewerId: socket.id });

        debugState();

      } catch (error) {
        console.error('❌ Watch device error:', error);
        socket.emit('error', 'Failed to watch device');
      }
    });

    // Handle PIN-based connection
    socket.on('join_with_pin', (data) => {
      try {
        const { pin } = data;
        
        console.log('🔑 PIN join attempt:', pin);
        console.log('Available devices:', Array.from(devices.entries()).map(([id, d]) => ({
          id,
          pin: d.pin,
          online: d.online
        })));
        
        if (!pin) {
          socket.emit('error', 'PIN is required');
          return;
        }

        // Find device by PIN
        let targetDevice = null;
        for (let [deviceId, device] of devices) {
          console.log(`🔍 Checking device ${deviceId} with PIN ${device.pin}`);
          if (device.pin === pin && device.online) {
            targetDevice = device;
            break;
          }
        }

        if (!targetDevice) {
          console.log('❌ No online device found with PIN:', pin);
          socket.emit('error', 'Invalid PIN or device not found/offline');
          return;
        }

        socket.join(targetDevice.device_id);
        
        if (!deviceRooms.has(targetDevice.device_id)) {
          deviceRooms.set(targetDevice.device_id, new Set());
        }
        deviceRooms.get(targetDevice.device_id).add(socket.id);

        console.log(`✅ Client ${socket.id} joined device ${targetDevice.device_id} with PIN`);
        console.log(`✅ Viewer ${socket.id} joined room: ${targetDevice.device_id}`);
        
        socket.emit('watching-started', { device_id: targetDevice.device_id });

        // Notify the device that someone is watching
        io.to(targetDevice.socketId).emit('viewer-connected', { viewerId: socket.id });

        debugState();

      } catch (error) {
        console.error('❌ PIN join error:', error);
        socket.emit('error', 'Failed to join with PIN');
      }
    });

    // Handle device list requests
    socket.on('devices:get', () => {
      try {
        const deviceList = Array.from(devices.values()).filter(d => d.online);
        socket.emit('devices:update', deviceList);
        console.log(`📋 Sent ${deviceList.length} online devices to client ${socket.id}`);
      } catch (error) {
        console.error('❌ Devices get error:', error);
        socket.emit('error', 'Failed to get devices');
      }
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log('❌ Client disconnected:', socket.id, 'Reason:', reason);
      
      // Remove device if it was a streaming device
      let deviceToRemove = null;
      for (let [deviceId, device] of devices) {
        if (device.socketId === socket.id) {
          console.log(`📴 Device ${deviceId} disconnected`);
          device.online = false;
          device.lastSeen = new Date();
          devices.set(deviceId, device);
          deviceToRemove = deviceId;
          break;
        }
      }
      
      // Remove viewer from all rooms
      for (let [deviceId, viewers] of deviceRooms) {
        if (viewers.has(socket.id)) {
          viewers.delete(socket.id);
          console.log(`❌ Viewer ${socket.id} left room: ${deviceId}`);
          
          if (viewers.size === 0) {
            deviceRooms.delete(deviceId);
            console.log(`🗑️ Removed empty room: ${deviceId}`);
          }
        }
      }
      
      // Broadcast updated device list (only online devices)
      const onlineDevices = Array.from(devices.values()).filter(d => d.online);
      io.emit('devices:update', onlineDevices);
      console.log(`📤 Broadcasted updated device list (${onlineDevices.length} online devices)`);
      
      debugState();
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    // Send initial device list on connection
    const initialDevices = Array.from(devices.values()).filter(d => d.online);
    socket.emit('devices:update', initialDevices);
    console.log(`📋 Sent initial ${initialDevices.length} devices to new client`);
  });

  // Periodic cleanup of offline devices (after 5 minutes of inactivity)
  setInterval(() => {
    const now = new Date();
    let cleanedCount = 0;
    
    for (let [deviceId, device] of devices) {
      // If device was last seen more than 5 minutes ago and is offline, remove it
      if (!device.online && now - device.lastSeen > 5 * 60 * 1000) {
        devices.delete(deviceId);
        deviceRooms.delete(deviceId);
        cleanedCount++;
        console.log(`🧹 Cleaned up offline device: ${deviceId}`);
      }
    }
    
    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} offline devices`);
      debugState();
    }
  }, 60 * 1000); // Run every minute

  // Debug function to show current state every 30 seconds
  setInterval(debugState, 30000);

  console.log('✅ DeviceSockets setup complete');
};