

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