
// require('dotenv').config();
// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const path = require('path');

// // Initialize Express app
// const app = express();
// const server = http.createServer(app);

// // Enhanced MongoDB Connection with retry logic
// const connectWithRetry = () => {
//   mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverSelectionTimeoutMS: 5000,
//     socketTimeoutMS: 45000
//   })
//   .then(() => console.log('✅ MongoDB Connected to Overwatch'))
//   .catch(err => {
//     console.error('❌ MongoDB Connection Error:', err);
//     setTimeout(connectWithRetry, 5000);
//   });
// };
// connectWithRetry();

// // Enhanced Middlewares
// app.use(cors({
//   origin: process.env.CLIENT_URL || 'http://localhost:3000',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Enhanced request logging
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
//   next();
// });

// // Route imports with validation
// const loadRoutes = () => {
//   try {
//     const authRoutes = require('./Backend/routes/authRoutes');
//     const deviceRoutes = require('./Backend/routes/deviceRoutes');
    
//     if (!authRoutes || !deviceRoutes) {
//       throw new Error('Route imports returned undefined');
//     }

//     app.use('/api/auth', authRoutes);
//     app.use('/api/device', deviceRoutes);
    
//     console.log('✅ Routes loaded successfully');
//   } catch (err) {
//     console.error('❌ Route loading failed:', err);
//     process.exit(1);
//   }
// };
// loadRoutes();

// // Health check endpoint with DB ping
// app.get('/health', async (req, res) => {
//   try {
//     await mongoose.connection.db.admin().ping();
//     res.status(200).json({
//       status: 'healthy',
//       db: 'connected',
//       timestamp: new Date().toISOString()
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'unhealthy',
//       db: 'disconnected',
//       error: err.message,
//       timestamp: new Date().toISOString()
//     });
//   }
// });

// // Socket.io Configuration with enhanced options
// const io = require('socket.io')(server, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:3000',
//     methods: ['GET', 'POST']
//   },
//   connectionStateRecovery: {
//     maxDisconnectionDuration: 2 * 60 * 1000,
//     skipMiddlewares: true
//   },
//   pingInterval: 10000,
//   pingTimeout: 5000,
//   transports: ['websocket', 'polling']
// });

// // Load socket handlers with validation
// const loadSockets = () => {
//   try {
//     const setupDeviceSockets = require('./Backend/sockets/deviceSockets');
//     if (typeof setupDeviceSockets !== 'function') {
//       throw new Error('Socket handler is not a function');
//     }
//     setupDeviceSockets(io);
//     console.log('✅ Socket.io handlers loaded');
//   } catch (err) {
//     console.error('❌ Failed to load socket handlers:', err);
//     process.exit(1);
//   }
// };
// loadSockets();

// // Enhanced error handling middleware
// app.use((err, req, res, next) => {
//   console.error('⚠️ Error:', err.stack);
//   res.status(500).json({ 
//     success: false,
//     error: 'Internal Server Error',
//     message: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     error: 'Endpoint not found'
//   });
// });

// // Start Server with port validation
// const PORT = parseInt(process.env.PORT) || 5000;
// if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
//   console.error('❌ Invalid PORT:', process.env.PORT);
//   process.exit(1);
// }

// server.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🔗 http://localhost:${PORT}`);
//   console.log(`🌐 CORS configured for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
// });

// // Graceful shutdown with timeout
// const shutdown = () => {
//   console.log('\n🛑 Shutting down gracefully...');
  
//   const shutdownTimeout = setTimeout(() => {
//     console.warn('⚠️ Forcing shutdown due to timeout');
//     process.exit(1);
//   }, 10000);

//   mongoose.connection.close(false)
//     .then(() => {
//       console.log('✅ MongoDB connection closed');
//       server.close(() => {
//         clearTimeout(shutdownTimeout);
//         console.log('✅ Server closed');
//         process.exit(0);
//       });
//     })
//     .catch(err => {
//       console.error('❌ Error closing MongoDB connection:', err);
//       process.exit(1);
//     });
// };

// process.on('SIGINT', shutdown);
// process.on('SIGTERM', shutdown);

// // Enhanced error handling
// process.on('unhandledRejection', (err) => {
//   console.error('⚠️ Unhandled Rejection:', err);
// });

// process.on('uncaughtException', (err) => {
//   console.error('⚠️ Uncaught Exception:', err);
//   shutdown();
// });


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

// MongoDB Connection
const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URI, {
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
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
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

// // Routes
// const authRoutes = require('./Backend/routes/authRoutes');
// const deviceRoutes = require('./Backend/routes/deviceRoutes');
// const superadminRoutes = require('./Backend/routes/superadmin');

const authRoutes = require('./Backend/routes/authRoutes');
const deviceRoutes = require('./Backend/routes/deviceRoutes');
const superadminRoutes = require('./Backend/routes/superadmin'); // ✅


// app.use('/api/superadmin', superadminRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/device', deviceRoutes);


app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/superadmin', superadminRoutes); // ✅




// Health check
app.get('/health', async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.status(200).json({ status: 'healthy', db: 'connected', timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: 'unhealthy', db: 'disconnected', error: err.message });
  }
});

// Socket.io setup
const io = socketio(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Socket handlers
const setupDeviceSockets = require('./Backend/sockets/deviceSockets');
setupDeviceSockets(io);

// Error handler
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start Server
const PORT = parseInt(process.env.PORT) || 5000;
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error('❌ Invalid PORT:', process.env.PORT);
  process.exit(1);
}

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🌐 CORS configured for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
});

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

