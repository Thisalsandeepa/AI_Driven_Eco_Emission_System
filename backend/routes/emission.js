// const express = require("express");
// const axios = require("axios");
// const router = express.Router();

// router.post("/predict-emission", async (req, res) => {
//   try {
//     const { features } = req.body;

//     const response = await axios.post("http://localhost:8000/predict", {
//       engineSize: features[0],
//       cylinders: features[1],
//       fuelConsumptionCity: features[2],
//       fuelConsumptionHighway: features[3],
//       transmission: features[4],
//       fuelType: features[5],
//       vehicleClass: features[6]
//     });

//     res.json(response.data);
//   } catch (err) {
//     console.error("Backend prediction error:", err.message);
//     res.status(500).json({ error: "Prediction failed at backend" });
//   }
// });

// module.exports = router;

const express = require("express");
const axios = require("axios");
const router = express.Router();
const authenticateToken = require("../middleware/auth");
const Prediction = require("../models/Prediction");

router.post("/predict-emission", authenticateToken, async (req, res) => {
  try {
    const { predictionInput, vehicleMeta } = req.body;
    const user = req.user;

    if (!user) return res.status(401).json({ error: "Unauthorized" });


    // Call FastAPI prediction service
    const response = await axios.post("http://localhost:8000/predict", predictionInput);

   console.log("📦 predictionInput:", predictionInput);
   console.log("🧠 FastAPI response:", response.data);

    const emissionLevel = response.data.label;

    console.log("💡 Emission Level from FastAPI:", emissionLevel);

    console.log("🔍 FastAPI raw response:", response.data);


    if (!emissionLevel) {
      return res.status(500).json({ error: "Model did not return a prediction label" });
    }

    // Save prediction to MongoDB
    await Prediction.create({
      userId: user.id,
      userName: user.name,
      make: vehicleMeta.make,
      model: vehicleMeta.model,
      emissionLevel,
      createdAt: new Date()
    });

    // Respond to frontend
    res.json({ label: emissionLevel });
  } catch (err) {
    console.error("Backend prediction error:", err);
    res.status(500).json({ error: "Prediction failed at backend" });
  }
});

module.exports = router;
