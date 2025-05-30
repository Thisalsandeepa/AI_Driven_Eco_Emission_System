// const express = require('express');
// const router = express.Router();
// const Vehicle = require('../models/Vehicle');
// const authenticateToken = require('../middleware/auth');

// // Add new vehicle
// router.post('/', authenticateToken, async (req, res) => {
//   try {
//     const { make, model, year, engineSize, fuelType, transmission, registrationNumber } = req.body;

//     const vehicle = new Vehicle({
//       userId: req.user.id,  // JWT decoded payload should have user `id`
//       make,
//       model,
//       year,
//       engineSize,
//       fuelType,
//       transmission,
//       registrationNumber
//     });

//     await vehicle.save();
//     res.status(201).json(vehicle);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to add vehicle', details: err.message });
//   }
// });

// // Get all vehicles for logged-in user
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const vehicles = await Vehicle.find({ userId: req.user.id });
//     res.status(200).json(vehicles);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch vehicles' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');
const authenticateToken = require('../middleware/auth');

// Add new vehicle
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { make, model, year, engineSize, fuelType, transmission, registrationNumber } = req.body;

    const vehicle = new Vehicle({
      userId: req.user.id,
      make,
      model,
      year,
      engineSize,
      fuelType,
      transmission,
      registrationNumber
    });

    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add vehicle', details: err.message });
  }
});

// Get all vehicles for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ userId: req.user.id });
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// ✅ Get a specific vehicle by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch vehicle', details: err.message });
  }
});

module.exports = router;
