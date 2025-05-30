const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  engineSize: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  registrationNumber: { type: String },
  imageUrl: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
