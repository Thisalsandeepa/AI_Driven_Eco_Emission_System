import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import H1 from '../assets/m1.jpg'

interface HeroProps {
  scrollToInfo: () => void;
}

const Hero = ({ scrollToInfo }: HeroProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePredictionClick = () => {
    navigate('/prediction-details');
  };

  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-center py-20 text-center lg:py-32">
          <h1 className="fade-in text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            The Best Way to Predict <br className="hidden sm:inline" />
            <span className="text-green-600">your vehicle emissions.</span>
          </h1>
          
          <p className="slide-up mt-6 max-w-2xl text-lg text-gray-600">
            Make informed decisions about your environmental impact. Our cutting-edge prediction 
            system helps you understand and reduce your vehicle's emissions.
          </p>
          
          <div className="slide-up mt-10 flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button
              onClick={handlePredictionClick}
              className="btn btn-primary group"
            >
              Prediction Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={scrollToInfo}
              className="btn btn-outline group"
            >
              See How It Works
              <ChevronDown className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
          
          <div className="slide-up mt-12 w-full max-w-4xl rounded-xl bg-white/80 p-4 shadow-lg backdrop-blur-sm sm:p-6 md:p-8">
            <img
              src={H1}
              alt="Vehicle emissions illustration"
              className="mx-auto h-auto w-full max-w-2xl rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;