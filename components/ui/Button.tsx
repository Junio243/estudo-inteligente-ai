
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  ...props 
}) => {
  const baseStyle = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center";

  let variantStyle = '';
  switch (variant) {
    case 'primary':
      variantStyle = 'bg-sky-600 hover:bg-sky-700 text-white focus:ring-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600 dark:focus:ring-sky-400';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:focus:ring-gray-500';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-400';
      break;
    case 'outline':
      variantStyle = 'bg-transparent hover:bg-sky-50 dark:hover:bg-sky-800 text-sky-600 dark:text-sky-400 border border-sky-600 dark:border-sky-400 focus:ring-sky-500 dark:focus:ring-sky-400';
      break;
  }

  let sizeStyle = '';
  switch (size) {
    case 'sm':
      sizeStyle = 'px-3 py-1.5 text-xs';
      break;
    case 'md':
      sizeStyle = 'px-4 py-2 text-sm';
      break;
    case 'lg':
      sizeStyle = 'px-6 py-3 text-base';
      break;
  }

  return (
    <button
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
