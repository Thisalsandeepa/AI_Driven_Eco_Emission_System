import { useEffect, useState } from 'react';

interface Prediction {
  _id: string;
  make: string;
  model: string;
  emissionLevel: string;
  createdAt: string;
}

const estimateCO2 = (level: string | undefined): number => {
  if (!level) return 0;
  switch (level.toLowerCase()) {
    case 'low': return 140;
    case 'medium': return 210;
    case 'high': return 300;
    default: return 0;
  }
};

const PredictionHistory = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/history', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();
        setPredictions(data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Prediction History</h1>
          <p className="mt-2 text-gray-600">
            Review your past emission predictions and see how your vehicles compare.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-md">
          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading...</p>
          ) : predictions.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No prediction history found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-200">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">Vehicle</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">Emission Level</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-green-700">CO₂ (g/km)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {predictions.map((item) => (
                    item.emissionLevel && (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {item.make} {item.model}
                        </td>
                        <td className="px-6 py-4 text-sm capitalize text-gray-700">
                          {item.emissionLevel}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {estimateCO2(item.emissionLevel)} g/km
                        </td>
                      </tr>
                    )
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionHistory;
