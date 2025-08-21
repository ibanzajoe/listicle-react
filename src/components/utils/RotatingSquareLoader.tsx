import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  colors?: [string, string, string, string]; // e.g., ['bg-blue-500', 'bg-green-500', ...]
  className?: string;
  text?: string;
}

export const RotatingSquaresLoader: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  colors = ['bg-blue-500', 'bg-green-500', 'bg-red-500', 'bg-yellow-500'],
  className,
  text = 'Loading...',
}) => {
  const containerSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  const squareSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
     <div role="status" className={clsx('flex flex-col items-center justify-center space-y-2', className)}>
      <div className={clsx('relative animate-spin', containerSizeClasses[size])}>
        {/* Position squares absolutely within the spinning container */}
        <div className={clsx('absolute top-0 left-0 rounded', squareSizeClasses[size], colors[0])}></div>
        <div className={clsx('absolute top-0 right-0 rounded', squareSizeClasses[size], colors[1])}></div>
        <div className={clsx('absolute bottom-0 left-0 rounded', squareSizeClasses[size], colors[2])}></div>
        <div className={clsx('absolute bottom-0 right-0 rounded', squareSizeClasses[size], colors[3])}></div>
      </div>
      <span className="sr-only">{text}</span>
      {/* <span className="text-sm text-gray-500">{text}</span> */}
    </div>
  );
};

// Example Usage:
// <RotatingSquaresLoader size="lg" colors={['bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-cyan-600']} />

// You could also export this as default if preferred
// export default RotatingSquaresLoader;