
import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = '', size = 'md' }) => {
  let sizeClasses = '';
  switch(size) {
    case 'sm':
      sizeClasses = 'w-6 h-6';
      break;
    case 'md':
      sizeClasses = 'w-8 h-8';
      break;
    case 'lg':
      sizeClasses = 'w-12 h-12';
      break;
  }
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full border-4 border-sky-500 border-t-transparent dark:border-sky-400 dark:border-t-transparent ${sizeClasses}`}
        role="status"
      >
        <span className="sr-only">Carregando...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
