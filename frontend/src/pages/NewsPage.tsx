import React from 'react';
import News from '../components/News';

const NewsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8">Environmental News Feed</h1>
        <News />
      </div>
    </div>
  );
};

export default NewsPage; 