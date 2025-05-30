import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface PredictionData {
  vehicleClass: string;
  engineSize: number;
  cylinders: number;
  transmission: string;
  fuelType: string;
  fuelConsumptionCity: number;
  fuelConsumptionHighway: number;
  make: string;
  model: string;
}

interface PredictionFormProps {
  onSubmit: (data: PredictionData) => void;
  initialData?: Partial<PredictionData>;
}

const PredictionForm = ({ onSubmit, initialData }: PredictionFormProps) => {
  const [formData, setFormData] = useState<PredictionData>({
    vehicleClass: initialData?.vehicleClass || '',
    engineSize: initialData?.engineSize || 2.0,
    cylinders: initialData?.cylinders || 4,
    transmission: initialData?.transmission || '',
    fuelType: initialData?.fuelType || '',
    fuelConsumptionCity: initialData?.fuelConsumptionCity || 10,
    fuelConsumptionHighway: initialData?.fuelConsumptionHighway || 7,
    make: initialData?.make || '',
    model: initialData?.model || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['engineSize', 'cylinders', 'fuelConsumptionCity', 'fuelConsumptionHighway'].includes(name)
        ? parseFloat(value)
        : value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.make.trim()) newErrors.make = 'Vehicle make is required';
    if (!formData.model.trim()) newErrors.model = 'Vehicle model is required';
    if (!formData.vehicleClass) newErrors.vehicleClass = 'Vehicle class is required';
    if (!formData.transmission) newErrors.transmission = 'Transmission is required';
    if (!formData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (formData.engineSize <= 0) newErrors.engineSize = 'Engine size must be greater than 0';
    if (formData.cylinders <= 0) newErrors.cylinders = 'Cylinders must be greater than 0';
    if (formData.fuelConsumptionCity <= 0) newErrors.fuelConsumptionCity = 'City fuel consumption must be greater than 0';
    if (formData.fuelConsumptionHighway <= 0) newErrors.fuelConsumptionHighway = 'Highway fuel consumption must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData); // send full form data
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Vehicle Make */}
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700">
            Vehicle Make
          </label>
          <input
            type="text"
            id="make"
            name="make"
            value={formData.make}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.make ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
            placeholder="e.g., Toyota"
          />
          {errors.make && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.make}
            </p>
          )}
        </div>

        {/* Vehicle Model */}
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Vehicle Model
          </label>
          <input
            type="text"
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.model ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
            placeholder="e.g., Corolla"
          />
          {errors.model && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.model}
            </p>
          )}
        </div>

        {/* Vehicle Class */}
        <div>
          <label htmlFor="vehicleClass" className="block text-sm font-medium text-gray-700">
            Vehicle Class
          </label>
          <select
            id="vehicleClass"
            name="vehicleClass"
            value={formData.vehicleClass}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.vehicleClass ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
          >
            <option value="">Select Vehicle Class</option>
            <option value="Vehicle Class_COMPACT">Compact</option>
            <option value="Vehicle Class_MID-SIZE">Mid-Size</option>
            <option value="Vehicle Class_FULL-SIZE">Full-Size</option>
            <option value="Vehicle Class_SUV - SMALL">SUV</option>
            <option value="Vehicle Class_PICKUP TRUCK - SMALL">Pickup Truck</option>
            <option value="Vehicle Class_MINIVAN">Minivan</option>
          </select>
          {errors.vehicleClass && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.vehicleClass}
            </p>
          )}
        </div>

        {/* Transmission */}
        <div>
          <label htmlFor="transmission" className="block text-sm font-medium text-gray-700">
            Transmission
          </label>
          <select
            id="transmission"
            name="transmission"
            value={formData.transmission}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.transmission ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
          >
            <option value="">Select Transmission</option>
            <option value="M6">Manual</option>
            <option value="A6">Automatic</option>
            <option value="AM6">Automated Manual</option>
            <option value="AV">Continuously Variable</option>
          </select>
          {errors.transmission && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.transmission}
            </p>
          )}
        </div>

        {/* Fuel Type */}
        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700">
            Fuel Type
          </label>
          <select
            id="fuelType"
            name="fuelType"
            value={formData.fuelType}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.fuelType ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
          >
            <option value="">Select Fuel Type</option>
            <option value="X">Regular Gasoline</option>
            <option value="Z">Premium Gasoline</option>
            <option value="D">Diesel</option>
            <option value="E">Ethanol (E85)</option>
            <option value="N">Natural Gas</option>
          </select>
          {errors.fuelType && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.fuelType}
            </p>
          )}
        </div>

        {/* Engine Size */}
        <div>
          <label htmlFor="engineSize" className="block text-sm font-medium text-gray-700">
            Engine Size (L)
          </label>
          <input
            type="number"
            id="engineSize"
            name="engineSize"
            step="0.1"
            min="0.1"
            value={formData.engineSize}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.engineSize ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
          />
          {errors.engineSize && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.engineSize}
            </p>
          )}
        </div>

        {/* Cylinders */}
        <div>
          <label htmlFor="cylinders" className="block text-sm font-medium text-gray-700">
            Cylinders
          </label>
          <input
            type="number"
            id="cylinders"
            name="cylinders"
            min="1"
            step="1"
            value={formData.cylinders}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.cylinders ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
          />
          {errors.cylinders && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.cylinders}
            </p>
          )}
        </div>

        {/* Fuel Consumption City */}
        <div>
          <label htmlFor="fuelConsumptionCity" className="block text-sm font-medium text-gray-700">
            Fuel Consumption City (L/100km)
          </label>
          <input
            type="number"
            id="fuelConsumptionCity"
            name="fuelConsumptionCity"
            step="0.1"
            min="0.1"
            value={formData.fuelConsumptionCity}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.fuelConsumptionCity ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
          />
          {errors.fuelConsumptionCity && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.fuelConsumptionCity}
            </p>
          )}
        </div>

        {/* Fuel Consumption Highway */}
        <div>
          <label htmlFor="fuelConsumptionHighway" className="block text-sm font-medium text-gray-700">
            Fuel Consumption Highway (L/100km)
          </label>
          <input
            type="number"
            id="fuelConsumptionHighway"
            name="fuelConsumptionHighway"
            step="0.1"
            min="0.1"
            value={formData.fuelConsumptionHighway}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.fuelConsumptionHighway ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500`}
          />
          {errors.fuelConsumptionHighway && (
            <p className="mt-1 flex items-center text-xs text-red-600">
              <AlertCircle className="mr-1 h-3 w-3" />
              {errors.fuelConsumptionHighway}
            </p>
          )}
        </div>
      </div>

      <div>
        <button type="submit" className="btn btn-primary w-full md:w-auto">
          Predict Emissions
        </button>
      </div>
    </form>
  );
};

export default PredictionForm;
