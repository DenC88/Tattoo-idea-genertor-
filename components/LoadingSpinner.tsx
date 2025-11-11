
import React from 'react';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
  };
  const spaceClass = {
    sm: 'space-x-1',
    md: 'space-x-1.5',
  }

  return (
    <div className={`flex justify-center items-center ${spaceClass[size]}`}>
        <div className={`${sizeClasses[size]} rounded-full bg-gray-300 animate-bounce [animation-delay:-0.3s]`}></div>
        <div className={`${sizeClasses[size]} rounded-full bg-gray-300 animate-bounce [animation-delay:-0.15s]`}></div>
        <div className={`${sizeClasses[size]} rounded-full bg-gray-300 animate-bounce`}></div>
    </div>
  );
};

export default LoadingSpinner;
