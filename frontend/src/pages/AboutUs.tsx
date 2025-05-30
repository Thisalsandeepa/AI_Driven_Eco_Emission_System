import { Car, Award, Users, Globe } from 'lucide-react';
import A1 from '../assets/ab1.jpg';

const AboutUs = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-green-700 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            About EcoEmissions
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-green-100">
            We're on a mission to reduce vehicle emissions and make the world a cleaner, greener place.
          </p>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-green-600">Our Mission</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Creating a Sustainable Future
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
              EcoEmissions was founded with a simple yet powerful mission: to help vehicle owners understand 
              and reduce their environmental impact through actionable insights and recommendations.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="relative h-64 overflow-hidden rounded-lg sm:h-80 md:h-full">
                <img
                  className="absolute inset-0 h-full w-full object-cover"
                  src={A1}
                  alt="Team working on sustainable solutions"
                />
              </div>
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Why We Started</h3>
                  <p className="mt-3 text-gray-600">
                    With climate change becoming an increasingly urgent issue, we saw an opportunity to empower 
                    individuals with the knowledge and tools to make a difference. Transportation is one of the 
                    largest sources of greenhouse gas emissions, and we believe that small changes can lead to 
                    significant impact when adopted at scale.
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Our Approach</h3>
                  <p className="mt-3 text-gray-600">
                    We combine cutting-edge machine learning technology with a user-friendly interface to provide 
                    accurate predictions and practical recommendations. Our team of environmental scientists, data 
                    engineers, and software developers work tirelessly to refine our models and enhance the user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Core Values */}
      <div className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-green-600">Our Core Values</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              What Drives Us Forward
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gray-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Environmental Stewardship</h3>
                <p className="mt-2 text-gray-600">
                  We're committed to protecting the planet and preserving it for future generations.
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Excellence</h3>
                <p className="mt-2 text-gray-600">
                  We strive for accuracy, reliability, and continuous improvement in everything we do.
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Community</h3>
                <p className="mt-2 text-gray-600">
                  We believe in the power of collective action and fostering a community of environmentally conscious individuals.
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Car className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Innovation</h3>
                <p className="mt-2 text-gray-600">
                  We leverage cutting-edge technology to solve environmental challenges in creative ways.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="py-16 sm:py-24 bg-green-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-green-600">How We Make an Impact</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Driving Real Change for a Greener Tomorrow
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-xl text-gray-600">
              EcoEmissions empowers individuals and communities to reduce their carbon footprint and make informed decisions for a sustainable future.
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Tangible Emission Reductions</h3>
                <p className="mt-2 text-gray-600">
                  Our users have collectively reduced thousands of tons of CO₂ by following our recommendations and tracking their vehicle maintenance.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Community Engagement</h3>
                <p className="mt-2 text-gray-600">
                  We foster a vibrant community of eco-conscious drivers, sharing tips and success stories to inspire others to join the movement.
                </p>
              </div>
              <div className="rounded-lg bg-white p-6 text-center shadow-sm">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Recognized Results</h3>
                <p className="mt-2 text-gray-600">
                  Our platform has been recognized by environmental organizations for its measurable impact and innovative approach to sustainability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;