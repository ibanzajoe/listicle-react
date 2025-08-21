import React from 'react';
import clsx from 'clsx';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // e.g., 'bg-teal-500'
  className?: string;
  text?: string;
}

export const BouncingBarLoader: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'bg-teal-500',
  className,
  text = 'Loading...',
}) => {
  const containerHeight = { sm: 'h-8', md: 'h-10', lg: 'h-12' };
  const barWidth = { sm: 'w-1', md: 'w-1.5', lg: 'w-2' };

  const barBaseClasses = clsx('inline-block', containerHeight[size], barWidth[size], color);

  return (
    <div role="status" className={clsx('flex flex-col items-center justify-center space-y-2', className)}>
      {/* Container to align bars at the bottom */}
      <div className={clsx("flex items-end justify-center space-x-1", containerHeight[size])}>
        <div className={clsx(barBaseClasses, 'animate-bounce-bar-1')}></div>
        <div className={clsx(barBaseClasses, 'animate-bounce-bar-2')}></div>
        <div className={clsx(barBaseClasses, 'animate-bounce-bar-3')}></div>
        <div className={clsx(barBaseClasses, 'animate-bounce-bar-4')}></div>
        <div className={clsx(barBaseClasses, 'animate-bounce-bar-5')}></div>
      </div>
       <span className="sr-only">{text}</span>
       {/* <span className="text-sm text-gray-500">{text}</span> */}
    </div>
  );
};

// Example Usage:
// <BouncingBarLoader size="lg" color="bg-orange-500" />

// You could also export this as default if preferred
// export default BouncingBarLoader;