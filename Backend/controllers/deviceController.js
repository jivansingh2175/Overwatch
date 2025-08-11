// // D:\jivan study\Self project\Overwatch\Backend\controllers\deviceController.js

// const Device = require('../../models/device');
// const bcrypt = require('bcryptjs');

// // ✅ Register Device
// exports.registerDevice = async (req, res) => {
//   if (req.user?.role !== 'admin') {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   // const { device_id, name, access_key } = req.body;
//   const { device_id, name, access_key, client_id } = req.body;

//   try {
//     const existing = await Device.findOne({ device_id });
//     if (existing) return res.status(400).json({ msg: 'Device already exists' });

//     const hashedKey = await bcrypt.hash(access_key, 10);

//     const device = await Device.create({
//       device_id,
//       name,
//       access_key: hashedKey,
//        client_id, // 👈 Save client association
//       registered_by: req.user.id
//     });

//     res.status(201).json({ msg: 'Device registered successfully', device_id: device.device_id });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // ✅ Get All Devices
// exports.getDevices = async (req, res) => {
//   try {
//     const devices = await Device.find().populate('registered_by', 'name email');
//     res.json(devices);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // ✅ Get One Device
// exports.getStatus = async (req, res) => {
//   try {
//     const device = await Device.findById(req.params.id);
//     if (!device) return res.status(404).json({ msg: 'Device not found' });

//     res.json(device);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// console.log("=== Inside deviceController.js (Exports) ===");
// console.log(module.exports); // Log the entire module.exports object
// console.log("Exported Methods:", Object.keys(module.exports)); // Log the keys of the exports object


// // deviceController.js
// const Device = require('../../models/device');
// const User = require('../../models/user');
// const bcrypt = require('bcryptjs');


// // Register Device (Superadmin or Client can register)
// exports.registerDevice = async (req, res) => {
//   if (req.user?.role !== 'superadmin' && req.user?.role !== 'client') {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   const { device_id, name, access_key, assignedTo } = req.body;

//   try {
//     const existing = await Device.findOne({ device_id });
//     if (existing) return res.status(400).json({ msg: 'Device already exists' });

//     const hashedKey = await bcrypt.hash(access_key, 10);
    
//     // Determine client - superadmin can specify, client defaults to themselves
//     const clientId = req.user.role === 'superadmin' 
//       ? req.body.clientId 
//       : req.user._id;

//     if (!clientId) {
//       return res.status(400).json({ msg: 'Client ID is required' });
//     }

//     const device = await Device.create({
//       device_id,
//       name,
//       access_key: hashedKey,
//       client: clientId,
//       assigned_to: assignedTo || null,
//       registered_by: req.user.id
//     });

//     // If assigned to a user, add to their devices array
//     if (assignedTo) {
//       await User.findByIdAndUpdate(assignedTo, {
//         $addToSet: { devices: device._id }
//       });
//     }

//     res.status(201).json({ 
//       msg: 'Device registered successfully', 
//       device: {
//         id: device._id,
//         device_id: device.device_id,
//         name: device.name,
//         client: device.client,
//         assigned_to: device.assigned_to
//       }
//     });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get All Devices (with filters based on role)
// exports.getDevices = async (req, res) => {
//   try {
//     let query = {};
    
//     // Clients can only see their organization's devices
//     if (req.user.role === 'client') {
//       query.client = req.user._id;
//     }
    
//     // Users can only see their assigned devices
//     if (req.user.role === 'user') {
//       query.assigned_to = req.user._id;
//     }

//     const devices = await Device.find(query)
//       .populate('client', 'name email')
//       .populate('assigned_to', 'name email')
//       .populate('registered_by', 'name email');
      
//     res.json(devices);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Get Device Status (with access control)
// exports.getStatus = async (req, res) => {
//   try {
//     const device = await Device.findById(req.params.id)
//       .populate('client', 'name email')
//       .populate('assigned_to', 'name email');
      
//     if (!device) return res.status(404).json({ msg: 'Device not found' });

//     // Check access
//     if (req.user.role === 'client' && !device.client.equals(req.user._id)) {
//       return res.status(403).json({ msg: 'Access denied' });
//     }
    
//     if (req.user.role === 'user' && (!device.assigned_to || !device.assigned_to.equals(req.user._id))) {
//       return res.status(403).json({ msg: 'Access denied' });
//     }

//     res.json(device);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

// // Assign Device to User
// exports.assignDevice = async (req, res) => {
//   if (req.user?.role !== 'superadmin' && req.user?.role !== 'client') {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   const { deviceId, userId } = req.body;

//   try {
//     const device = await Device.findById(deviceId);
//     const user = await User.findById(userId);

//     if (!device || !user) {
//       return res.status(404).json({ msg: 'Device or user not found' });
//     }

//     // Verify client can only assign their own devices
//     if (req.user.role === 'client' && !device.client.equals(req.user._id)) {
//       return res.status(403).json({ msg: 'Access denied' });
//     }

//     // Verify user belongs to client organization
//     if (req.user.role === 'client' && (!user.client || !user.client.equals(req.user._id))) {
//       return res.status(403).json({ msg: 'User does not belong to your organization' });
//     }

//     // Update device assignment
//     device.assigned_to = userId;
//     await device.save();

//     // Add device to user's devices array
//     await User.findByIdAndUpdate(userId, {
//       $addToSet: { devices: device._id }
//     });

//     res.json({ msg: 'Device assigned successfully' });
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };


// const mongoose = require('mongoose');
// const Device = require('../../models/device');
// const User = require('../../models/user');
// const bcrypt = require('bcryptjs');

// // Enhanced registerDevice with better validation
// const registerDevice = async (req, res) => {
//   const allowedRoles = ['superadmin', 'client'];
//   if (!allowedRoles.includes(req.user?.role)) {
//     return res.status(403).json({ 
//       success: false,
//       error: 'Access denied. Only superadmins and clients can register devices'
//     });
//   }

//   const { device_id, name, access_key, assignedTo } = req.body;

//   // Validate required fields
//   if (!device_id || !name || !access_key) {
//     return res.status(400).json({
//       success: false,
//       error: 'Missing required fields: device_id, name, access_key'
//     });
//   }

//   try {
//     // Check for existing device
//     const existing = await Device.findOne({ device_id });
//     if (existing) {
//       return res.status(400).json({ 
//         success: false,
//         error: 'Device already exists' 
//       });
//     }

//     // Determine client ID based on role
//     const clientId = req.user.role === 'superadmin' 
//       ? req.body.clientId || req.user._id
//       : req.user._id;

//     // Hash the access key
//     const hashedKey = await bcrypt.hash(access_key, 12);

//     // Create new device
//     const device = await Device.create({
//       device_id,
//       name,
//       access_key: hashedKey,
//       client: clientId,
//       assigned_to: assignedTo || null,
//       registered_by: req.user.id
//     });

//     // If assigned to a user, update user's devices
//     if (assignedTo) {
//       await User.findByIdAndUpdate(
//         assignedTo,
//         { $addToSet: { devices: device._id } },
//         { new: true }
//       );
//     }

//     // Successful response
//     res.status(201).json({ 
//       success: true,
//       message: 'Device registered successfully',
//       data: {
//         id: device._id,
//         device_id: device.device_id,
//         name: device.name,
//         client: device.client,
//         assigned_to: device.assigned_to
//       }
//     });

//   } catch (err) {
//     console.error('Device registration error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error during device registration',
//       details: err.message 
//     });
//   }
// };

// // Enhanced getDevices with better filtering
// const getDevices = async (req, res) => {
//   try {
//     let query = {};
    
//     // Apply role-based filters
//     switch (req.user.role) {
//       case 'client':
//         query.client = req.user._id;
//         break;
//       case 'user':
//         query.assigned_to = req.user._id;
//         break;
//       // superadmin gets all devices by default
//     }

//     const devices = await Device.find(query)
//       .populate('client', 'name email')
//       .populate('assigned_to', 'name email')
//       .populate('registered_by', 'name email')
//       .lean();

//     res.json({
//       success: true,
//       count: devices.length,
//       data: devices
//     });
//   } catch (err) {
//     console.error('Get devices error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to fetch devices',
//       details: err.message 
//     });
//   }
// };

// // Enhanced getStatus with better error handling
// const getStatus = async (req, res) => {
//   try {
//     const device = await Device.findById(req.params.id)
//       .populate('client', 'name email')
//       .populate('assigned_to', 'name email');

//     if (!device) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Device not found' 
//       });
//     }

//     // Verify access rights
//     let hasAccess = false;
//     switch (req.user.role) {
//       case 'superadmin':
//         hasAccess = true;
//         break;
//       case 'client':
//         hasAccess = device.client && device.client._id.equals(req.user._id);
//         break;
//       case 'user':
//         hasAccess = device.assigned_to && device.assigned_to._id.equals(req.user._id);
//         break;
//     }

//     if (!hasAccess) {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Access denied to this device' 
//       });
//     }

//     res.json({
//       success: true,
//       data: device
//     });
//   } catch (err) {
//     console.error('Get device status error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to get device status',
//       details: err.message 
//     });
//   }
// };

// // Enhanced assignDevice with transaction support
// const assignDevice = async (req, res) => {
//   const allowedRoles = ['superadmin', 'client'];
//   if (!allowedRoles.includes(req.user?.role)) {
//     return res.status(403).json({ 
//       success: false,
//       error: 'Access denied' 
//     });
//   }

//   const { deviceId, userId } = req.body;

//   if (!deviceId || !userId) {
//     return res.status(400).json({ 
//       success: false,
//       error: 'Missing deviceId or userId' 
//     });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const device = await Device.findById(deviceId).session(session);
//     const user = await User.findById(userId).session(session);

//     if (!device || !user) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ 
//         success: false,
//         error: 'Device or user not found' 
//       });
//     }

//     // Verify client can only assign their own devices
//     if (req.user.role === 'client' && 
//         (!device.client || !device.client.equals(req.user._id))) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ 
//         success: false,
//         error: 'Access denied to this device' 
//       });
//     }

//     // Verify user belongs to client organization
//     if (req.user.role === 'client' && 
//         (!user.client || !user.client.equals(req.user._id))) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ 
//         success: false,
//         error: 'User does not belong to your organization' 
//       });
//     }

//     // Update device assignment
//     device.assigned_to = userId;
//     await device.save({ session });

//     // Add device to user's devices array
//     await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { devices: device._id } },
//       { new: true, session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ 
//       success: true,
//       message: 'Device assigned successfully' 
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Assign device error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to assign device',
//       details: err.message 
//     });
//   }
// };

// module.exports = {
//   registerDevice,
//   getDevices,
//   getStatus,
//   assignDevice
// };





// const mongoose = require('mongoose');
// const Device = require('../../models/device');
// const User = require('../../models/user');
// const bcrypt = require('bcryptjs');

// /**
//  * @desc Register a new device
//  * @route POST /api/device/register
//  * @access Private (superadmin, client)
//  */
// const registerDevice = async (req, res) => {
//   const allowedRoles = ['superadmin', 'client'];
//   if (!allowedRoles.includes(req.user?.role)) {
//     return res.status(403).json({ 
//       success: false,
//       error: 'Access denied. Only superadmins and clients can register devices'
//     });
//   }

//   const { device_id, name, access_key, assignedTo } = req.body;

//   // Validate required fields
//   if (!device_id || !name || !access_key) {
//     return res.status(400).json({
//       success: false,
//       error: 'Missing required fields: device_id, name, access_key'
//     });
//   }

//   // Validate device_id format
//   if (!/^[A-Za-z0-9-]+$/.test(device_id)) {
//     return res.status(400).json({
//       success: false,
//       error: 'Device ID can only contain letters, numbers and hyphens'
//     });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     // Check for existing device
//     const existing = await Device.findOne({ device_id }).session(session);
//     if (existing) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(400).json({ 
//         success: false,
//         error: 'Device already exists' 
//       });
//     }

//     // Determine client - superadmin can specify, client defaults to themselves
//     const clientId = req.user.role === 'superadmin' 
//       ? req.body.clientId || req.user._id
//       : req.user._id;

//     // Verify client exists if specified
//     if (req.body.clientId && req.user.role === 'superadmin') {
//       const clientExists = await User.exists({ 
//         _id: req.body.clientId, 
//         role: 'client' 
//       }).session(session);
//       if (!clientExists) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({
//           success: false,
//           error: 'Specified client organization does not exist'
//         });
//       }
//     }

//     // Hash the access key
//     const hashedKey = await bcrypt.hash(access_key, 12);

//     // Create new device
//     const [device] = await Device.create([{
//       device_id,
//       name,
//       access_key: hashedKey,
//       client: clientId,
//       assigned_to: assignedTo || null,
//       registered_by: req.user.id,
//       online: false,
//       last_seen: null
//     }], { session });

//     // If assigned to a user, update user's devices
//     if (assignedTo) {
//       // Verify user exists and belongs to client organization
//       const user = await User.findOne({
//         _id: assignedTo,
//         client: clientId
//       }).session(session);

//       if (!user) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(400).json({
//           success: false,
//           error: 'User does not exist or does not belong to your organization'
//         });
//       }

//       await User.findByIdAndUpdate(
//         assignedTo,
//         { $addToSet: { devices: device._id } },
//         { session }
//       );
//     }

//     await session.commitTransaction();
//     session.endSession();

//     res.status(201).json({ 
//       success: true,
//       message: 'Device registered successfully',
//       data: {
//         id: device._id,
//         device_id: device.device_id,
//         name: device.name,
//         client: device.client,
//         assigned_to: device.assigned_to
//       }
//     });

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Device registration error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Server error during device registration',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// /**
//  * @desc Get all devices (with filters)
//  * @route GET /api/device/list
//  * @access Private
//  */
// const getDevices = async (req, res) => {
//   try {
//     let query = {};
//     const { clientId, assignedTo, online, search } = req.query;
    
//     // Apply role-based filters
//     switch (req.user.role) {
//       case 'client':
//         query.client = req.user._id;
//         break;
//       case 'user':
//         query.assigned_to = req.user._id;
//         break;
//       // superadmin gets all devices by default
//     }

//     // Additional filters
//     if (clientId && req.user.role === 'superadmin') {
//       query.client = clientId;
//     }
//     if (assignedTo) {
//       query.assigned_to = assignedTo;
//     }
//     if (online !== undefined) {
//       query.online = online === 'true';
//     }
//     if (search) {
//       query.$or = [
//         { device_id: { $regex: search, $options: 'i' } },
//         { name: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const devices = await Device.find(query)
//       .populate('client', 'name email')
//       .populate('assigned_to', 'name email')
//       .populate('registered_by', 'name email')
//       .sort({ createdAt: -1 })
//       .lean();

//     res.json({
//       success: true,
//       count: devices.length,
//       data: devices
//     });
//   } catch (err) {
//     console.error('Get devices error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to fetch devices',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// /**
//  * @desc Get device status
//  * @route GET /api/device/status/:id
//  * @access Private
//  */
// const getStatus = async (req, res) => {
//   try {
//     const device = await Device.findById(req.params.id)
//       .populate('client', 'name email')
//       .populate('assigned_to', 'name email')
//       .populate('registered_by', 'name email');

//     if (!device) {
//       return res.status(404).json({ 
//         success: false,
//         error: 'Device not found' 
//       });
//     }

//     // Verify access rights
//     let hasAccess = false;
//     switch (req.user.role) {
//       case 'superadmin':
//         hasAccess = true;
//         break;
//       case 'client':
//         hasAccess = device.client && device.client._id.equals(req.user._id);
//         break;
//       case 'user':
//         hasAccess = device.assigned_to && device.assigned_to._id.equals(req.user._id);
//         break;
//     }

//     if (!hasAccess) {
//       return res.status(403).json({ 
//         success: false,
//         error: 'Access denied to this device'
//       });
//     }

//     res.json({
//       success: true,
//       data: device
//     });
//   } catch (err) {
//     console.error('Get device status error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to get device status',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// /**
//  * @desc Assign device to user
//  * @route POST /api/device/assign
//  * @access Private (superadmin, client)
//  */
// const assignDevice = async (req, res) => {
//   const allowedRoles = ['superadmin', 'client'];
//   if (!allowedRoles.includes(req.user?.role)) {
//     return res.status(403).json({ 
//       success: false,
//       error: 'Access denied' 
//     });
//   }

//   const { deviceId, userId } = req.body;

//   if (!deviceId || !userId) {
//     return res.status(400).json({ 
//       success: false,
//       error: 'Missing deviceId or userId' 
//     });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const device = await Device.findById(deviceId).session(session);
//     const user = await User.findById(userId).session(session);

//     if (!device || !user) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ 
//         success: false,
//         error: 'Device or user not found' 
//       });
//     }

//     // Verify client can only assign their own devices
//     if (req.user.role === 'client') {
//       if (!device.client || !device.client.equals(req.user._id)) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(403).json({ 
//           success: false,
//           error: 'Access denied to this device' 
//         });
//       }

//       // Verify user belongs to client organization
//       if (!user.client || !user.client.equals(req.user._id)) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(403).json({ 
//           success: false,
//           error: 'User does not belong to your organization' 
//         });
//       }
//     }

//     // For superadmin, verify user is not another superadmin
//     if (req.user.role === 'superadmin' && user.role === 'superadmin') {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(403).json({ 
//         success: false,
//         error: 'Cannot assign devices to other superadmins' 
//       });
//     }

//     // First remove from previous user if assigned
//     if (device.assigned_to) {
//       await User.findByIdAndUpdate(
//         device.assigned_to,
//         { $pull: { devices: device._id } },
//         { session }
//       );
//     }

//     // Update device assignment
//     device.assigned_to = userId;
//     await device.save({ session });

//     // Add device to new user's devices array
//     await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { devices: device._id } },
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ 
//       success: true,
//       message: 'Device assigned successfully',
//       data: {
//         deviceId: device._id,
//         userId: user._id,
//         previousUser: device.assigned_to
//       }
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Assign device error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to assign device',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// /**
//  * @desc Unassign device from user
//  * @route POST /api/device/unassign
//  * @access Private (superadmin, client)
//  */
// const unassignDevice = async (req, res) => {
//   const allowedRoles = ['superadmin', 'client'];
//   if (!allowedRoles.includes(req.user?.role)) {
//     return res.status(403).json({ 
//       success: false,
//       error: 'Access denied' 
//     });
//   }

//   const { deviceId } = req.body;

//   if (!deviceId) {
//     return res.status(400).json({ 
//       success: false,
//       error: 'Missing deviceId' 
//     });
//   }

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const device = await Device.findById(deviceId).session(session);

//     if (!device) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({ 
//         success: false,
//         error: 'Device not found' 
//       });
//     }


//     // Verify permissions
//     if (req.user.role === 'client') {
//       if (!device.client || !device.client.equals(req.user._id)) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(403).json({ 
//           success: false,
//           error: 'Access denied to this device' 
//         });
//       }
//     }

//     // Remove from current user if assigned
//     if (device.assigned_to) {
//       await User.findByIdAndUpdate(
//         device.assigned_to,
//         { $pull: { devices: device._id } },
//         { session }
//       );
//     }

//     // Update device
//     const previousUser = device.assigned_to;
//     device.assigned_to = null;
//     await device.save({ session });

//     await session.commitTransaction();
//     session.endSession();

//     res.json({ 
//       success: true,
//       message: 'Device unassigned successfully',
//       data: {
//         deviceId: device._id,
//         previousUser
//       }
//     });
//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error('Unassign device error:', err);
//     res.status(500).json({ 
//       success: false,
//       error: 'Failed to unassign device',
//       details: process.env.NODE_ENV === 'development' ? err.message : undefined
//     });
//   }
// };

// module.exports = {
//   registerDevice,
//   getDevices,
//   getStatus,
//   assignDevice,
//   unassignDevice
// };









const mongoose = require('mongoose');
const Device = require('../../models/device');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

/**
 * @desc Register a new device
 * @route POST /api/device/register
 * @access Private (superadmin, client)
 */
const registerDevice = async (req, res) => {
  const allowedRoles = ['superadmin', 'client'];
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({ 
      success: false,
      error: 'Access denied. Only superadmins and clients can register devices'
    });
  }

  const { device_id, name, access_key, assignedTo } = req.body;

  if (!device_id || !name || !access_key) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: device_id, name, access_key'
    });
  }

  if (!/^[A-Za-z0-9-]+$/.test(device_id)) {
    return res.status(400).json({
      success: false,
      error: 'Device ID can only contain letters, numbers and hyphens'
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existing = await Device.findOne({ device_id }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, error: 'Device already exists' });
    }

    const clientId = req.user.role === 'superadmin' 
      ? req.body.clientId || req.user._id
      : req.user._id;

    if (req.body.clientId && req.user.role === 'superadmin') {
      const clientExists = await User.exists({ _id: req.body.clientId, role: 'client' }).session(session);
      if (!clientExists) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, error: 'Specified client organization does not exist' });
      }
    }

    const hashedKey = await bcrypt.hash(access_key, 12);

    const [device] = await Device.create([{
      device_id,
      name,
      access_key: hashedKey,
      client: clientId,
      assigned_to: assignedTo || null,
      registered_by: req.user.id,
      online: false,
      last_seen: null
    }], { session });

    if (assignedTo) {
      const user = await User.findOne({ _id: assignedTo, client: clientId }).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ success: false, error: 'User does not exist or does not belong to your organization' });
      }

      await User.findByIdAndUpdate(assignedTo, { $addToSet: { devices: device._id } }, { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ 
      success: true,
      message: 'Device registered successfully',
      data: {
        id: device._id,
        device_id: device.device_id,
        name: device.name,
        client: device.client,
        assigned_to: device.assigned_to
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Device registration error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Server error during device registration',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

/**
 * @desc Get all devices (with filters)
 * @route GET /api/device/list
 * @access Private
 */
const getDevices = async (req, res) => {
  try {
    let query = {};
    const { clientId, assignedTo, online, search } = req.query;

    switch (req.user.role) {
      case 'client':
        query.client = req.user._id;
        break;
      case 'user':
        query.assigned_to = req.user._id;
        break;
    }

    if (clientId && req.user.role === 'superadmin') query.client = clientId;
    if (assignedTo) query.assigned_to = assignedTo;
    if (online !== undefined) query.online = online === 'true';
    if (search) {
      query.$or = [
        { device_id: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    const devices = await Device.find(query)
      .populate('client', 'name email')
      .populate('assigned_to', 'name email')
      .populate('registered_by', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, count: devices.length, data: devices });
  } catch (err) {
    console.error('Get devices error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch devices' });
  }
};

/**
 * @desc Get device status
 * @route GET /api/device/status/:id
 * @access Private
 */
const getStatus = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('client', 'name email')
      .populate('assigned_to', 'name email')
      .populate('registered_by', 'name email');

    if (!device) {
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    let hasAccess = false;
    switch (req.user.role) {
      case 'superadmin':
        hasAccess = true;
        break;
      case 'client':
        hasAccess = device.client && device.client._id.equals(req.user._id);
        break;
      case 'user':
        hasAccess = device.assigned_to && device.assigned_to._id.equals(req.user._id);
        break;
    }

    if (!hasAccess) {
      return res.status(403).json({ success: false, error: 'Access denied to this device' });
    }

    res.json({ success: true, data: device });
  } catch (err) {
    console.error('Get device status error:', err);
    res.status(500).json({ success: false, error: 'Failed to get device status' });
  }
};

/**
 * @desc Assign device to user
 * @route POST /api/device/assign
 * @access Private (superadmin, client)
 */
const assignDevice = async (req, res) => {
  const allowedRoles = ['superadmin', 'client'];
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }

  const { deviceId, userId } = req.body;
  if (!deviceId || !userId) {
    return res.status(400).json({ success: false, error: 'Missing deviceId or userId' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const device = await Device.findById(deviceId).session(session);
    const user = await User.findById(userId).session(session);

    if (!device || !user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, error: 'Device or user not found' });
    }

    if (req.user.role === 'client') {
      if (!device.client || !device.client.equals(req.user._id)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, error: 'Access denied to this device' });
      }

      if (!user.client || !user.client.equals(req.user._id)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, error: 'User does not belong to your organization' });
      }
    }

    if (req.user.role === 'superadmin' && user.role === 'superadmin') {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ success: false, error: 'Cannot assign devices to other superadmins' });
    }

    if (device.assigned_to) {
      await User.findByIdAndUpdate(
        device.assigned_to,
        { $pull: { devices: device._id } },
        { session }
      );
    }

    device.assigned_to = userId;
    await device.save({ session });

    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { devices: device._id } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      success: true,
      message: 'Device assigned successfully',
      data: {
        deviceId: device._id,
        userId: user._id
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Assign device error:', err);
    res.status(500).json({ success: false, error: 'Failed to assign device' });
  }
};

/**
 * @desc Unassign device from user
 * @route POST /api/device/unassign
 * @access Private (superadmin, client)
 */
const unassignDevice = async (req, res) => {
  const allowedRoles = ['superadmin', 'client'];
  if (!allowedRoles.includes(req.user?.role)) {
    return res.status(403).json({ success: false, error: 'Access denied' });
  }

  const { deviceId } = req.body;
  if (!deviceId) {
    return res.status(400).json({ success: false, error: 'Missing deviceId' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const device = await Device.findById(deviceId).session(session);
    if (!device) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, error: 'Device not found' });
    }

    if (req.user.role === 'client') {
      if (!device.client || !device.client.equals(req.user._id)) {
        await session.abortTransaction();
        session.endSession();
        return res.status(403).json({ success: false, error: 'Access denied to this device' });
      }
    }

    if (device.assigned_to) {
      await User.findByIdAndUpdate(
        device.assigned_to,
        { $pull: { devices: device._id } },
        { session }
      );
    }

    device.assigned_to = null;
    await device.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ 
      success: true,
      message: 'Device unassigned successfully',
      data: {
        deviceId: device._id
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error('Unassign device error:', err);
    res.status(500).json({ success: false, error: 'Failed to unassign device' });
  }
};

/**
 * @desc Get all devices assigned to a specific user
 * @route GET /api/devices/by-user/:userId
 * @access Private (client or superadmin)
 */
const getDevicesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role === 'client') {
      const user = await User.findById(userId);
      if (!user || user.client?.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied: User not part of your organization'
        });
      }
    }

    const devices = await Device.find({ assigned_to: userId })
      .populate('client', 'name email')
      .populate('assigned_to', 'name email')
      .lean();

    res.json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (err) {
    console.error('Error in getDevicesByUser:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch devices for user'
    });
  }
};

module.exports = {
  registerDevice,
  getDevices,
  getStatus,
  assignDevice,
  unassignDevice,
  getDevicesByUser
};
