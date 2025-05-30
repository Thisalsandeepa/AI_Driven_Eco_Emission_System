// src/components/WelcomeMessage.tsx
import { useAuth } from '../contexts/AuthContext';

const WelcomeMessage = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="text-lg font-semibold text-gray-800 mt-4">
      Hello, {user.name}!
    </div>
  );
};

export default WelcomeMessage;
