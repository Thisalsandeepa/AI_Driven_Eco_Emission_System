const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const Vehicle = require('../models/Vehicle');
const Prediction = require('../models/Prediction');
const Message = require('../models/Message');
const MaintenanceNotification = require('../models/MaintenanceNotification');
const User = require('../models/User');

// Get all vehicles
router.get('/vehicles', auth, adminAuth, async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all predictions
router.get('/predictions', auth, adminAuth, async (req, res) => {
  try {
    const predictions = await Prediction.find().sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all contact messages
router.get('/messages', auth, adminAuth, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reply to a message
router.post('/messages/:id/reply', auth, adminAuth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.reply = req.body.reply;
    message.repliedAt = new Date();
    message.read = true;
    await message.save();

    // Send email notification to user
    // TODO: Implement email sending functionality

    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all maintenance notifications
router.get('/notifications', auth, adminAuth, async (req, res) => {
  try {
    const notifications = await MaintenanceNotification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a vehicle
router.delete('/vehicles/:id', auth, adminAuth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Delete associated predictions
    await Prediction.deleteMany({ vehicleId: vehicle._id });
    
    // Delete the vehicle
    await Vehicle.findByIdAndDelete(vehicle._id);

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard statistics
router.get('/stats', auth, adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVehicles = await Vehicle.countDocuments();
    const totalPredictions = await Prediction.countDocuments();
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });

    const emissionDistribution = await Prediction.aggregate([
      {
        $group: {
          _id: '$emissionLevel',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalVehicles,
      totalPredictions,
      totalMessages,
      unreadMessages,
      emissionDistribution
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; 