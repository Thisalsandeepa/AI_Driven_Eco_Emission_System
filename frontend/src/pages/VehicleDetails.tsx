import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Car, Calendar, Gauge, Fuel, Settings, AlertTriangle, TrendingUp } from 'lucide-react';

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

interface Maintenance {
  _id: string;
  date: string;
  type: string;
  mileage: number;
  cost?: number;
  notes?: string;
}

interface Prediction {
  emissionLevel: string;
  createdAt: string;
}

const maintenanceOptions = [
  { type: 'Oil Change', days: 90, mileage: 5000 },
  { type: 'Tire Rotation', days: 120, mileage: 8000 },
  { type: 'Brake Inspection', days: 180, mileage: 15000 },
  { type: 'Emission Check', days: 365, mileage: 20000 },
];

const VehicleDetails = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [latestPrediction, setLatestPrediction] = useState<Prediction | null>(null);
  const [form, setForm] = useState({ date: '', type: '', mileage: '', cost: '', notes: '' });
  const [editRecordId, setEditRecordId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dueReminders, setDueReminders] = useState<string[]>([]);
  const [nextOilChangeMileage, setNextOilChangeMileage] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        setError('Authentication required');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch vehicle data
        const vehicleRes = await axios.get(`http://localhost:5000/api/vehicles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicle(vehicleRes.data);

        // Fetch maintenance data
        const maintenanceRes = await axios.get(`http://localhost:5000/api/maintenance/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaintenance(maintenanceRes.data);

        // Fetch latest prediction
        try {
          const predictionRes = await axios.get(
            `http://localhost:5000/api/history/latest/${vehicleRes.data.make}/${vehicleRes.data.model}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setLatestPrediction(predictionRes.data);
        } catch (error) {
          console.error('Error fetching latest prediction:', error);
          // Don't set error state for prediction failure
        }
      } catch (error) {
        console.error('Error fetching vehicle data:', error);
        setError('Failed to load vehicle data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, token]);

  useEffect(() => {
    const reminders: string[] = [];
    const shownTypes = new Set<string>();

    const iconMap: Record<string, string> = {
      'Oil Change': '🛢️',
      'Tire Rotation': '🔁',
      'Brake Inspection': '🛑',
      'Emission Check': '🔬',
    };

    maintenanceOptions.forEach((option) => {
      const records = maintenance.filter((m) => m.type === option.type);
      if (records.length === 0) return;

      // Find the last maintenance by mileage
      const lastByMileage = records.reduce((a, b) => a.mileage > b.mileage ? a : b);
      const nextDueMileage = lastByMileage.mileage + option.mileage;
      reminders.push(`Next ${option.type} at: ${nextDueMileage.toLocaleString()} km`);

      // Optionally, keep the toast for user feedback
      if (option.mileage && !shownTypes.has(option.type)) {
        toast(`${iconMap[option.type] || '🔧'} Next ${option.type} at: ${nextDueMileage.toLocaleString()} km`, {
          duration: 5000,
          position: 'top-center',
          icon: iconMap[option.type] || '🔧',
        });
        shownTypes.add(option.type);
      }

      if (option.type === 'Oil Change') {
        setNextOilChangeMileage(nextDueMileage);
      }
    });

    setDueReminders(reminders);
  }, [maintenance]);

  const refreshRecords = async () => {
    const res = await axios.get(`http://localhost:5000/api/maintenance/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMaintenance(res.data);
    setEditRecordId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/maintenance',
        {
          vehicleId: id,
          ...form,
          mileage: Number(form.mileage),
          cost: Number(form.cost),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm({ date: '', type: '', mileage: '', cost: '', notes: '' });
      refreshRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (record: Maintenance) => {
    setEditRecordId(record._id);
    setForm({
      date: record.date.substring(0, 10),
      type: record.type,
      mileage: record.mileage.toString(),
      cost: record.cost?.toString() || '',
      notes: record.notes || '',
    });
  };

  const handleUpdate = async () => {
    if (!editRecordId) return;
    try {
      await axios.put(
        `http://localhost:5000/api/maintenance/${editRecordId}`,
        {
          ...form,
          mileage: Number(form.mileage),
          cost: Number(form.cost),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      refreshRecords();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/maintenance/${recordId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      refreshRecords();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900">Error Loading Vehicle</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900">Vehicle not found</h2>
          <p className="mt-2 text-gray-600">The vehicle you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>

        {/* Header Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="relative h-48 bg-gradient-to-r from-green-500 to-green-600">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {vehicle.make} {vehicle.model}
              </h1>
              <p className="text-green-100 text-lg">{vehicle.year}</p>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Settings className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Engine</p>
                    <p className="font-semibold">{vehicle.engineSize}L</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Fuel className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-semibold">{vehicle.fuelType}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Gauge className="h-6 w-6 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-semibold">{vehicle.transmission}</p>
                  </div>
                </div>
              </div>
              
              {vehicle.registrationNumber && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Car className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Registration</p>
                      <p className="font-semibold">{vehicle.registrationNumber}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Maintenance Alerts & Prediction */}
          <div className="lg:col-span-2 space-y-8">
            {/* Maintenance Alerts */}
            {dueReminders.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                  Maintenance Alerts
                </h3>
                <ul className="space-y-3">
                  {dueReminders.map((msg, index) => (
                    <li key={index} className="flex items-center text-yellow-700 bg-yellow-50 p-3 rounded-md">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                      {msg}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Latest Prediction */}
            {latestPrediction && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                  Latest Emission Prediction
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-700 mr-3">Emission Level:</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        latestPrediction.emissionLevel.toLowerCase() === 'low' ? 'bg-green-100 text-green-800' :
                        latestPrediction.emissionLevel.toLowerCase() === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {latestPrediction.emissionLevel}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {new Date(latestPrediction.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/prediction/${vehicle._id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Predict Emission
                  </button>
                </div>
              </div>
            )}

            {/* Maintenance History */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance History</h3>
              <div className="space-y-4">
                {maintenance.map((rec) => (
                  <div key={rec._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{rec.type}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(rec.date).toLocaleDateString()} • {rec.mileage} km
                        </p>
                        {rec.notes && (
                          <p className="text-gray-600 mt-2">{rec.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {rec.cost && (
                          <span className="text-sm font-medium text-green-600">
                            Rs. {rec.cost.toLocaleString()}
                          </span>
                        )}
                        <button
                          onClick={() => handleEdit(rec)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rec._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Add Maintenance Form */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Maintenance Record</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  >
                    <option value="">Select Type</option>
                    {maintenanceOptions.map((opt) => (
                      <option key={opt.type} value={opt.type}>{opt.type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Mileage</label>
                  <input
                    type="number"
                    name="mileage"
                    value={form.mileage}
                    onChange={handleChange}
                    required
                    placeholder="Enter mileage"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Cost</label>
                  <input
                    type="number"
                    name="cost"
                    value={form.cost}
                    onChange={handleChange}
                    placeholder="Enter cost"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Add any additional notes"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                {editRecordId ? (
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleUpdate}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    >
                      Update Record
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditRecordId(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors duration-200"
                  >
                    Add Record
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {maintenance.length > 0 && (
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Maintenance Analytics</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Maintenance Cost Chart */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Monthly Maintenance Cost</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.values(
                        maintenance.reduce((acc, record) => {
                          const month = new Date(record.date).toLocaleString('default', { month: 'short', year: 'numeric' });
                          acc[month] = acc[month] || { month, total: 0 };
                          acc[month].total += record.cost || 0;
                          return acc;
                        }, {} as Record<string, { month: string; total: number }>)
                      )}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Total Cost']}
                        labelFormatter={(label) => `Month: ${label}`}
                      />
                      <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Maintenance Types Distribution Chart */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Maintenance Types Distribution</h4>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.values(
                          maintenance.reduce((acc, record) => {
                            acc[record.type] = acc[record.type] || { type: record.type, count: 0 };
                            acc[record.type].count += 1;
                            return acc;
                          }, {} as Record<string, { type: string; count: number }>)
                        )}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#16a34a"
                        label={({ type, percent }) => `${type} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {['#16a34a', '#65a30d', '#0f766e', '#7c3aed', '#dc2626'].map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} records`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;


