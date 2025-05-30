import { useNavigate } from 'react-router-dom';
import { Leaf, Gauge, BarChart, LineChart, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PredictionDetails = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="bg-gray-50">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Vehicle Emission <span className="text-green-600">Prediction</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Understand your vehicle's impact on the environment with our comprehensive emission prediction system.
          </p>
        </div>

        {/* Features */}
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                <Leaf className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Environmental Awareness</h3>
              <p className="mt-2 text-gray-600">
                Gain insight into your vehicle's carbon footprint and make informed decisions to reduce your environmental impact.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                <Gauge className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Fuel Efficiency</h3>
              <p className="mt-2 text-gray-600">
                Optimize your driving habits and vehicle maintenance to improve fuel efficiency and save money.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-100 text-teal-600">
                <BarChart className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Data-Driven Insights</h3>
              <p className="mt-2 text-gray-600">
                Access detailed data about your vehicle's emissions and identify areas for improvement.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mx-auto mt-16 max-w-7xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            How Our Prediction System Works
          </h2>
          
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <span className="text-sm font-medium">1</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Enter Vehicle Parameters</h3>
                    <p className="mt-1 text-gray-600">
                      Provide details about your vehicle's class, engine size, fuel type, and more.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <span className="text-sm font-medium">2</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Advanced Analysis</h3>
                    <p className="mt-1 text-gray-600">
                      Our algorithm processes the data through machine learning models trained on thousands of vehicles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Receive Predictions</h3>
                    <p className="mt-1 text-gray-600">
                      Get accurate predictions of your vehicle's CO2 emissions and environmental impact.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <span className="text-sm font-medium">4</span>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Actionable Recommendations</h3>
                    <p className="mt-1 text-gray-600">
                      Receive personalized tips to reduce emissions and improve your vehicle's efficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="aspect-square w-full max-w-md overflow-hidden rounded-xl bg-white p-2 shadow-lg">
                <img
                  src="https://images.pexels.com/photos/8294554/pexels-photo-8294554.jpeg?auto=compress&cs=tinysrgb&w=1600"
                  alt="Emission prediction analysis"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Demo Section */}
        <div className="hero-gradient mx-auto mt-24 max-w-7xl rounded-2xl p-8 sm:p-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Ready to Get Your Vehicle's Emission Prediction?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Access our prediction tool now to analyze your vehicle's emissions and receive personalized recommendations.
            </p>
            <div className="mt-10">
              <button
                onClick={() => {
                  if (user) {
                    navigate('/prediction');
                  } else {
                    localStorage.setItem('postLoginRedirect', '/prediction');
                    navigate('/login');
                  }
                }}
                className="btn btn-primary group"
              >
                Get Prediction
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mx-auto mt-24 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 rounded-xl bg-white p-8 shadow-sm sm:grid-cols-2 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">10M+</p>
              <p className="mt-2 text-sm text-gray-600">Predictions Generated</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">25%</p>
              <p className="mt-2 text-sm text-gray-600">Average Emission Reduction</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">98%</p>
              <p className="mt-2 text-sm text-gray-600">Prediction Accuracy</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600">200K+</p>
              <p className="mt-2 text-sm text-gray-600">Happy Users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionDetails;