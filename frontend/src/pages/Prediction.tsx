import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PredictionForm, { PredictionData } from '../components/PredictionForm';
import PredictionResult, { EmissionLevel } from '../components/PredictionResult';
import axios from 'axios';

const estimateCO2 = (level: string): number => {
  switch (level.toLowerCase()) {
    case 'low': return 100;  // Average for low emission range (0-150)
    case 'medium': return 200;  // Average for medium emission range (151-250)
    case 'high': return 300;  // Average for high emission range (251+)
    default: return 0;
  }
};

const Prediction = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{
    level: EmissionLevel;
    co2Value: number;
    isVisible: boolean;
    make: string;
    model: string;
  }>({
    level: 'medium',
    co2Value: 0,
    isVisible: false,
    make: '',
    model: ''
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setVehicle(response.data);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handlePredictionSubmit = async (formData: PredictionData) => {
    setPredictionResult(prev => ({ ...prev, isVisible: false }));

    const predictionInput = {
      vehicleClass: formData.vehicleClass,
      engineSize: formData.engineSize,
      cylinders: formData.cylinders,
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      fuelConsumptionCity: formData.fuelConsumptionCity,
      fuelConsumptionHighway: formData.fuelConsumptionHighway
    };

    const vehicleMeta = {
      make: formData.make,
      model: formData.model
    };

    try {
      const response = await fetch('/api/predict-emission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ predictionInput, vehicleMeta })
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error("Invalid JSON response");
        return;
      }

      if (response.ok && data.label) {
        const level = data.label.toLowerCase() as EmissionLevel;
        const co2 = estimateCO2(level);

        setPredictionResult({
          level,
          co2Value: co2,
          isVisible: true,
          make: vehicleMeta.make,
          model: vehicleMeta.model
        });
      } else {
        console.error('Prediction failed:', data?.error || 'No prediction returned');
        console.log("💡 Full response data:", data);
      }
    } catch (error) {
      console.error('Prediction failed:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading vehicle data...</div>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Predict Your Vehicle's Emissions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Enter your vehicle information below to get an estimate of its CO₂ emissions and environmental impact.
          </p>
        </div>

        <div className="mt-12">
          <div className="overflow-hidden rounded-xl bg-white p-6 shadow-sm sm:p-8">
            <PredictionForm 
              onSubmit={handlePredictionSubmit} 
              initialData={vehicle ? {
                make: vehicle.make,
                model: vehicle.model,
                engineSize: vehicle.engineSize,
                fuelType: vehicle.fuelType,
                transmission: vehicle.transmission,
                // Add other fields as needed
              } : undefined}
            />

            {predictionResult.isVisible && (
              <>
                <PredictionResult
                  level={predictionResult.level}
                  co2Value={predictionResult.co2Value}
                  isVisible={predictionResult.isVisible}
                  make={predictionResult.make}
                  model={predictionResult.model}
                />
                <div className="mt-6 text-center">
                  <Link to="/history" className="inline-block text-sm text-green-600 hover:underline">
                    View My Prediction History →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prediction;

