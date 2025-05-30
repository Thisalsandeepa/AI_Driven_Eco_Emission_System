const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  make: String,
  model: String,
  emissionLevel: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prediction', PredictionSchema);
