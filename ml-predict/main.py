# from fastapi import FastAPI, Request
# from pydantic import BaseModel
# import numpy as np
# import tensorflow as tf
# import joblib
# import uvicorn

# app = FastAPI()

# # Load components
# model = tf.keras.models.load_model("emission_level_classifier_model.h5")
# scaler = joblib.load("emission_level_scaler.pkl")
# label_encoder = joblib.load("emission_level_label_encoder.pkl")

# class InputData(BaseModel):
#     features: list  # e.g., [12.3, 45.6, ...]

# @app.post("/predict")
# async def predict(data: InputData):
#     scaled = scaler.transform([data.features])
#     prediction = model.predict(scaled)
#     predicted_class = np.argmax(prediction, axis=1)
#     label = label_encoder.inverse_transform(predicted_class)[0]
#     return {"prediction": label}

from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import json

app = FastAPI()

# Load model and preprocessors
model = tf.keras.models.load_model("emission_level_classifier_model.h5")
scaler = joblib.load("emission_level_scaler.pkl")
label_encoder = joblib.load("emission_level_label_encoder.pkl")

# Load expected input column names from training
with open("input_columns.json", "r") as f:
    expected_columns = json.load(f)

# Pydantic input model
class InputData(BaseModel):
    engineSize: float
    cylinders: int
    fuelConsumptionCity: float
    fuelConsumptionHighway: float
    transmission: str
    fuelType: str
    vehicleClass: str

@app.post("/predict")
async def predict(data: InputData):
    try:
        # 🌐 Transform values to match model's one-hot encoded format
        transformed_input = {
            "Engine Size(L)": data.engineSize,
            "Cylinders": data.cylinders,
            "Fuel Consumption City (L/100 km)": data.fuelConsumptionCity,
            "Fuel Consumption Hwy (L/100 km)": data.fuelConsumptionHighway,
            f"Transmission_{data.transmission}": 1,
            f"Fuel Type_{data.fuelType}": 1,
            f"Vehicle Class_{data.vehicleClass}": 1,
        }

        # 🔧 Fill missing expected columns with 0
        full_input = {col: 0 for col in expected_columns}
        for key, value in transformed_input.items():
            if key in full_input:
                full_input[key] = value

        # 🧾 Create DataFrame for model input
        df_encoded = pd.DataFrame([full_input])
        print("✅ Input for Prediction:\n", df_encoded)

        # 📊 Scale input
        scaled_input = scaler.transform(df_encoded)

        # 🔮 Model Prediction
        prediction = model.predict(scaled_input)
        predicted_class = np.argmax(prediction, axis=1)
        predicted_label = label_encoder.inverse_transform(predicted_class)[0]

        print("✅ Prediction:", predicted_label)
        return {"label": predicted_label}


    except Exception as e:
        print("❌ Error:", str(e))
        return {"prediction": "Prediction failed", "error": str(e)}
