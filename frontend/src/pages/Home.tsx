import { useRef } from 'react';
import Hero from '../components/Hero';
import WelcomeMessage from '../components/WelcomeMessage'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Wrench, ShieldCheck, Wallet2, Award, ChevronRight } from 'lucide-react';

const Home = () => {
  const infoSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const scrollToInfo = () => {
    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGetStarted = () => {
    navigate('/prediction');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div>
      <Hero scrollToInfo={scrollToInfo} />

      {/* ✅ Greeting Message */}
      {user && (
        <div className="mt-6 px-6 text-center text-xl font-semibold text-gray-800">
          <WelcomeMessage />
        </div>
      )}

      {/* How It Works Section */}
      <section ref={infoSectionRef} className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Check How System Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Our emission prediction system uses advanced algorithms to estimate your vehicle's environmental impact.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-6 transition-transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Enter Vehicle Details</h3>
                <p className="mt-2 text-gray-600">
                  Provide information about your vehicle's make, model, year, and other specifications.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6 transition-transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Process Data</h3>
                <p className="mt-2 text-gray-600">
                  Our system analyzes your vehicle data using machine learning algorithms.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6 transition-transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Generate Prediction</h3>
                <p className="mt-2 text-gray-600">
                  Receive accurate emission predictions based on your vehicle's characteristics.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-6 transition-transform hover:scale-105">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <span className="text-xl font-bold">4</span>
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Get Recommendations</h3>
                <p className="mt-2 text-gray-600">
                  Learn how to reduce your environmental impact with personalized suggestions.
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={handleGetStarted}
                className="btn btn-primary group"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="hero-gradient py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Use Our Maintenance Dashboard?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Stay organized, save money, and extend your vehicle's life with smart maintenance tracking.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="flex flex-col items-start rounded-xl bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Wrench className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Proactive Maintenance</h3>
                <p className="mt-2 text-gray-600">
                  Get timely reminders for oil changes, brake checks, and more, before problems become expensive.
                </p>
              </div>

              <div className="flex flex-col items-start rounded-xl bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <Wallet2 className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Cost Efficiency</h3>
                <p className="mt-2 text-gray-600">
                  Avoid surprise repairs by keeping track of maintenance records and upcoming service needs.
                </p>
              </div>

              <div className="flex flex-col items-start rounded-xl bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-100 text-teal-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Improved Safety</h3>
                <p className="mt-2 text-gray-600">
                  Ensure your vehicle is always in top condition, reducing the risk of breakdowns and accidents.
                </p>
              </div>

              <div className="flex flex-col items-start rounded-xl bg-white/90 p-6 shadow-sm backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-orange-100 text-orange-600">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Long-Term Value</h3>
                <p className="mt-2 text-gray-600">
                  Maintain resale value and extend the lifespan of your car with consistent upkeep history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-700 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white/10 px-6 py-10 backdrop-blur-sm sm:px-12 sm:py-16">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to manage your vehicle's maintenance?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-green-100">
                Track services, get timely reminders, and keep your vehicle running at its best — all in one dashboard.
              </p>
              <div className="mt-10">
                <button
                  onClick={handleGoToDashboard}
                  className="btn bg-white text-green-700 hover:bg-green-50"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
