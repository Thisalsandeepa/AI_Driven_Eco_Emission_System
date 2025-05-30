import { Check, AlertTriangle, AlertOctagon, Car, Wrench, Leaf, Gauge, Fuel, Route, Sparkles, Settings, Users, Filter } from 'lucide-react';

export type EmissionLevel = 'low' | 'medium' | 'high';

interface PredictionResultProps {
  level: EmissionLevel;
  co2Value: number;
  isVisible: boolean;
  make: string;
  model: string;
}

const PredictionResult = ({ level, co2Value, isVisible, make, model }: PredictionResultProps) => {
  if (!isVisible) return null;

  const levelConfig = {
    low: {
      color: 'bg-green-100 border-green-500 text-green-800',
      icon: <Check className="h-6 w-6 text-green-600" />,
      title: 'Low Emissions',
      description: 'Your vehicle has relatively low CO₂ emissions. Keep up the good work!',
      emissionRange: '0-150 g/km',
      tips: [
        { icon: <Wrench className="h-5 w-5" />, text: 'Maintain regular service intervals to keep efficiency optimal' },
        { icon: <Leaf className="h-5 w-5" />, text: 'Use eco-driving techniques like smooth acceleration and coasting' },
        { icon: <Gauge className="h-5 w-5" />, text: 'Keep tires properly inflated to maintain fuel efficiency' },
        { icon: <Fuel className="h-5 w-5" />, text: 'Consider using premium fuel if recommended by manufacturer' },
        { icon: <Route className="h-5 w-5" />, text: 'Plan routes to avoid heavy traffic and reduce idling time' }
      ]
    },
    medium: {
      color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />,
      title: 'Medium Emissions',
      description: 'Your vehicle has moderate CO₂ emissions. There\'s room for improvement.',
      emissionRange: '151-250 g/km',
      tips: [
        { icon: <Car className="h-5 w-5" />, text: 'Consider upgrading to more efficient tires when replacing' },
        { icon: <Sparkles className="h-5 w-5" />, text: 'Remove unnecessary weight from your vehicle' },
        { icon: <Gauge className="h-5 w-5" />, text: 'Use cruise control on highways to maintain consistent speed' },
        { icon: <Route className="h-5 w-5" />, text: 'Combine multiple short trips into one to reduce cold starts' },
        { icon: <Fuel className="h-5 w-5" />, text: 'Consider using a fuel additive to improve combustion efficiency' }
      ]
    },
    high: {
      color: 'bg-red-100 border-red-500 text-red-800',
      icon: <AlertOctagon className="h-6 w-6 text-red-600" />,
      title: 'High Emissions',
      description: 'Your vehicle has high CO₂ emissions. Consider changes to reduce environmental impact.',
      emissionRange: '251+ g/km',
      tips: [
        { icon: <Car className="h-5 w-5" />, text: 'Consider upgrading to a more fuel-efficient vehicle when possible' },
        { icon: <Gauge className="h-5 w-5" />, text: 'Reduce aggressive driving behaviors like rapid acceleration and hard braking' },
        { icon: <Users className="h-5 w-5" />, text: 'Use public transportation or carpooling for regular commutes' },
        { icon: <Settings className="h-5 w-5" />, text: 'Consider installing an aftermarket fuel efficiency device' },
        { icon: <Filter className="h-5 w-5" />, text: 'Regularly check and replace air filters to maintain optimal engine performance' }
      ]
    }
  };

  const config = levelConfig[level];

  return (
    <div className={`slide-up mt-8 rounded-lg border-l-4 p-6 ${config.color}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium">{config.title}</h3>
          <div className="mt-1 text-sm font-medium text-gray-900">
            🚘 {make} {model}
          </div>
          <div className="mt-2">
            <p className="text-sm">{config.description}</p>
            <div className="mt-6 bg-white/50 rounded-lg p-4">
              <div className="mb-2 text-sm font-medium">Estimated CO₂ Emissions:</div>
              <div className="text-2xl font-bold">{co2Value.toFixed(1)} g/km</div>
              <div className="mt-1 text-sm text-gray-600">
                Emission Range: {config.emissionRange}
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-3 text-sm font-medium">Recommendations:</div>
              <div className="space-y-3">
                {config.tips.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 bg-white/50 rounded-lg p-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {tip.icon}
                    </div>
                    <p className="text-sm">{tip.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
