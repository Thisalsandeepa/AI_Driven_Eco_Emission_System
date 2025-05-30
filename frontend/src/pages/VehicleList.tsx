import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
  engineSize: number;
  fuelType: string;
  transmission: string;
  registrationNumber?: string;
}

const VehicleList = () => {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vehicles', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setVehicles(res.data);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [token]);

  const handleCardClick = (id: string) => {
    navigate(`/vehicles/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">Your Registered Vehicles</h1>

      {loading ? (
        <p className="text-center">Loading vehicles...</p>
      ) : vehicles.length === 0 ? (
        <p className="text-center text-gray-500">No vehicles found. Please add one!</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle._id}
              className="cursor-pointer rounded-xl border bg-white p-6 shadow-md hover:shadow-lg transition"
              onClick={() => handleCardClick(vehicle._id)}
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-1">
                {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-sm text-gray-600">Year: {vehicle.year}</p>
              <p className="text-sm text-gray-600">Engine: {vehicle.engineSize}L</p>
              <p className="text-sm text-gray-600">Fuel: {vehicle.fuelType}</p>
              <p className="text-sm text-gray-600">Transmission: {vehicle.transmission}</p>
              {vehicle.registrationNumber && (
                <p className="text-sm text-gray-500 mt-1">Reg No: {vehicle.registrationNumber}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;
