const express = require('express');
const router = express.Router();
const Maintenance = require('../models/Maintenance');
const authenticateToken = require('../middleware/auth');

// POST /api/maintenance → Add new maintenance record
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { vehicleId, date, type, mileage, cost, notes } = req.body;

    const maintenance = new Maintenance({
      vehicleId,
      date,
      type,
      mileage,
      cost,
      notes
    });

    await maintenance.save();
    res.status(201).json(maintenance);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add maintenance record', details: err.message });
  }
});

// GET /api/maintenance/:vehicleId → Get all records for a vehicle
router.get('/:vehicleId', authenticateToken, async (req, res) => {
  try {
    const records = await Maintenance.find({ vehicleId: req.params.vehicleId }).sort({ date: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch maintenance records', details: err.message });
  }
});

// PUT /api/maintenance/:id → Update a maintenance record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const updated = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Maintenance record not found' });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update record', details: err.message });
  }
});

// DELETE /api/maintenance/:id → Delete a maintenance record
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Maintenance.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete record', details: err.message });
  }
});

module.exports = router;
