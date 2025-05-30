const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  date: { type: Date, required: true },
  type: { type: String, required: true }, // e.g., "Oil Change"
  mileage: { type: Number, required: true },
  cost: { type: Number },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
