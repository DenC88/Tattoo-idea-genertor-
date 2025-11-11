
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-1.5">
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
    </div>
  );
};

export default LoadingSpinner;
