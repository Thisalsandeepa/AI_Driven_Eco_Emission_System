const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Prediction = require("../models/Prediction");

// GET /api/history - Get all predictions for logged-in user
router.get("/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const predictions = await Prediction.find({ userId }).sort({ createdAt: -1 });

    res.json(predictions);
  } catch (err) {
    console.error("Failed to fetch prediction history:", err);
    res.status(500).json({ error: "Failed to retrieve history" });
  }
});

// GET /api/history/latest/:make/:model - Get latest prediction for a specific vehicle
router.get("/history/latest/:make/:model", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { make, model } = req.params;

    const latestPrediction = await Prediction.findOne({
      userId,
      make,
      model
    }).sort({ createdAt: -1 });

    if (!latestPrediction) {
      return res.status(404).json({ error: "No predictions found for this vehicle" });
    }

    res.json(latestPrediction);
  } catch (err) {
    console.error("Failed to fetch latest prediction:", err);
    res.status(500).json({ error: "Failed to retrieve latest prediction" });
  }
});

module.exports = router;
