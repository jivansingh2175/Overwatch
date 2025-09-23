



// server.js - Updated with debug endpoints and enhanced logging
require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const socketio = require('socket.io');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Store devices map for debug endpoint (will be populated by deviceSockets)
let devices = new Map();

// MongoDB Connection
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/overwatch', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
  })
    .then(() => console.log('✅ MongoDB Connected to Overwatch'))
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

// CORS Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://overwatch-remote.netlify.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ✅ CORRECTED PATHS - Remove ./Backend/ since server.js is already in Backend
const authRoutes = require('./routes/authRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const superadminRoutes = require('./routes/superadmin');

app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/superadmin', superadminRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ 
      status: 'healthy', 
      db: 'connected', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'unhealthy', 
      db: 'disconnected', 
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint for socket connections
app.get('/api/debug/sockets', (req, res) => {
  try {
    if (!io || !io.sockets) {
      return res.status(500).json({ error: 'Socket.io not initialized' });
    }

    const sockets = Array.from(io.sockets.sockets.values()).map(socket => ({
      id: socket.id,
      rooms: Array.from(socket.rooms),
      connected: socket.connected,
      handshake: {
        headers: socket.handshake.headers,
        query: socket.handshake.query,
        time: socket.handshake.time
      }
    }));
    
    const rooms = Array.from(io.sockets.adapter.rooms.keys());
    
    // Get device information if available
    const deviceList = devices ? Array.from(devices.entries()).map(([id, device]) => ({
      device_id: id,
      name: device.name,
      socketId: device.socketId,
      pin: device.pin,
      online: device.online,
      createdAt: device.createdAt
    })) : [];

    res.json({
      totalSockets: sockets.length,
      totalRooms: rooms.length,
      sockets: sockets,
      rooms: rooms,
      activeDevices: deviceList,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ error: 'Failed to get socket info' });
  }
});

// Debug endpoint for system status
app.get('/api/debug/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Socket.io setup
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'https://overwatch-remote.netlify.app',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// ✅ CORRECTED PATH - Remove ./Backend/ since server.js is already in Backend
const setupDeviceSockets = require('./sockets/deviceSockets');

// Pass the devices map to the socket handler for debug access
setupDeviceSockets(io);

// Store reference to devices map for debug endpoint
io.on('connection', (socket) => {
  // This is just to get access to the devices map from the socket handler
  // The actual devices map is managed in deviceSockets.js
  socket.on('debug-get-devices', (callback) => {
    if (typeof callback === 'function') {
      callback(Array.from(devices.entries()));
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start Server
const PORT = parseInt(process.env.PORT) || 5000;
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error('❌ Invalid PORT:', process.env.PORT);
  process.exit(1);
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 Local test: http://localhost:${PORT}`);
  console.log(`🌐 CORS configured for: ${process.env.CLIENT_URL || 'https://overwatch-remote.netlify.app'}`);
  console.log(`📊 Debug endpoints available:`);
  console.log(`   - /health`);
  console.log(`   - /api/debug/sockets`);
  console.log(`   - /api/debug/status`);
});


// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🔗 http://localhost:${PORT}`);
//   console.log(`🌐 CORS configured for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
//   console.log(`📊 Debug endpoints available:`);
//   console.log(`   - http://localhost:${PORT}/health`);
//   console.log(`   - http://localhost:${PORT}/api/debug/sockets`);
//   console.log(`   - http://localhost:${PORT}/api/debug/status`);
// });

// Graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  const shutdownTimeout = setTimeout(() => {
    console.warn('⚠️ Forcing shutdown due to timeout');
    process.exit(1);
  }, 10000);

  mongoose.connection.close(false)
    .then(() => {
      console.log('✅ MongoDB connection closed');
      server.close(() => {
        clearTimeout(shutdownTimeout);
        console.log('✅ Server closed');
        process.exit(0);
      });
    })
    .catch(err => {
      console.error('❌ Error closing MongoDB connection:', err);
      process.exit(1);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Fallback error handlers
process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err);
  shutdown();
});

// Export for testing
module.exports = { app, server, io };