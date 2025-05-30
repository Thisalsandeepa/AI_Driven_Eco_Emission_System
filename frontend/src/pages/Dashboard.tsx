// Dashboard.tsx - Professional styled dashboard for vehicle maintenance app
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Car, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import News from '../components/News';

interface Vehicle {
  _id: string;
  make: string;
  model: string;
  year: number;
}

interface Maintenance {
  _id: string;
  date: string;
  type: string;
}

const maintenanceOptions = [
  { type: 'Oil Change', days: 90 },
  { type: 'Tire Rotation', days: 120 },
  { type: 'Brake Inspection', days: 180 },
  { type: 'Emission Check', days: 365 },
];

const Dashboard = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenanceMap, setMaintenanceMap] = useState<Record<string, Maintenance[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/vehicles', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVehicles(res.data);

        const map: Record<string, Maintenance[]> = {};
        await Promise.all(
          res.data.map(async (vehicle: Vehicle) => {
            const mRes = await axios.get(`http://localhost:5000/api/maintenance/${vehicle._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            map[vehicle._id] = mRes.data;
          })
        );
        setMaintenanceMap(map);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVehicles();
  }, [token]);

  const getDueReminders = (records: Maintenance[]) => {
    const now = new Date();
    const reminders: string[] = [];
    maintenanceOptions.forEach((option) => {
      const relevant = records.filter((r) => r.type === option.type);
      if (relevant.length === 0) return;
      const latest = relevant.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b);
      const lastDate = new Date(latest.date);
      const daysSince = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince >= option.days) {
        reminders.push(`${option.type} (${daysSince} days ago)`);
      }
    });
    return reminders;
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-green-700 mb-1">Welcome, {user?.name || 'User'}!</h1>
            <p className="text-gray-600">Manage your vehicles and maintenance reminders below.</p>
          </div>
          <button
            onClick={() => navigate('/vehicles/add')}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-full shadow hover:bg-green-700 transition"
          >
            <PlusCircle className="h-5 w-5" /> Add Vehicle
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="flex items-center bg-white rounded-xl shadow p-4">
          <Car className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <div className="text-lg font-bold">{vehicles.length}</div>
            <div className="text-gray-500 text-sm">Total Vehicles</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-xl shadow p-4">
          <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
          <div>
            <div className="text-lg font-bold">
              {vehicles.reduce((acc, v) => acc + getDueReminders(maintenanceMap[v._id] || []).length, 0)}
            </div>
            <div className="text-gray-500 text-sm">Overdue Reminders</div>
          </div>
        </div>
        <div className="flex items-center bg-white rounded-xl shadow p-4">
          <Calendar className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <div className="text-lg font-bold">
              {vehicles.length > 0
                ? (() => {
                    const allRecords = vehicles.flatMap(v => maintenanceMap[v._id] || []);
                    if (allRecords.length === 0) return 'N/A';
                    const last = new Date(
                      allRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
                    );
                    return last.toLocaleDateString();
                  })()
                : 'N/A'}
            </div>
            <div className="text-gray-500 text-sm">Last Maintenance</div>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="max-w-6xl mx-auto">
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <img src="/empty-garage.svg" alt="No vehicles" className="w-40 mb-6 opacity-80" />
            <div className="text-gray-600 text-lg mb-2">No vehicles registered yet.</div>
            <button
              onClick={() => navigate('/vehicles/add')}
              className="mt-2 inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            >
              <PlusCircle className="h-5 w-5" /> Add Your First Vehicle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vehicles.map((v) => {
              const records = maintenanceMap[v._id] || [];
              const reminders = getDueReminders(records);
              const last = records.length
                ? new Date(records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date)
                : null;

              return (
                <div
                  key={v._id}
                  className="rounded-2xl border border-green-100 bg-white p-6 shadow-md hover:shadow-lg transition cursor-pointer relative overflow-hidden group"
                  onClick={() => navigate(`/vehicles/${v._id}`)}
                >
                  <div className="flex items-center mb-2">
                    <Car className="h-6 w-6 text-green-600 mr-2" />
                    <h2 className="text-xl font-bold text-green-800">{v.make} {v.model}</h2>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Year: <span className="font-medium">{v.year}</span></p>
                  {last && (
                    <p className="text-sm text-gray-500 mb-2">Last Maintenance: {last.toLocaleDateString()}</p>
                  )}
                  {reminders.length > 0 ? (
                    <div className="mt-2 text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">{reminders.length} due: {reminders.join(', ')}</span>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm font-medium flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600">All up to date</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={e => { e.stopPropagation(); navigate(`/vehicles/${v._id}`); }}
                      className="text-green-700 hover:text-green-900 underline text-xs"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
