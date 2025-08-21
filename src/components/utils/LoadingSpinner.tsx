import React from 'react';
import clsx from 'clsx'; // Optional: for cleaner class joining (npm install clsx)

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // e.g., 'text-blue-500', 'text-red-600'
  className?: string;
  text?: string;
}

export const PulsingDotsLoader: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'bg-blue-600', // Use background color for dots
  className,
  text = 'Loading...',
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const dotBaseClasses = clsx('rounded-full', sizeClasses[size], color);

  return (
    <div role="status" className={clsx('flex flex-col items-center justify-center space-y-2', className)}>
      <div className="flex items-center justify-center space-x-2">
          <div className={clsx(dotBaseClasses, 'animate-pulse-dot-1')}></div>
          <div className={clsx(dotBaseClasses, 'animate-pulse-dot-2')}></div>
          <div className={clsx(dotBaseClasses, 'animate-pulse-dot-3')}></div>
      </div>
       {/* Accessibility: Visually hidden text for screen readers */}
       <span className="sr-only">{text}</span>
       {/* Optional: Visible text below */}
       {/* <span className="text-sm text-gray-500">{text}</span> */}
    </div>
  );
};

// You can make this the default export or create a wrapper component
const LoadingSpinner = PulsingDotsLoader;
export default LoadingSpinner;