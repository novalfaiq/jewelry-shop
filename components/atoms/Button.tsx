import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'light';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
};

const Button = ({ 
  children, 
  href, 
  variant = 'primary', 
  className = '',
  onClick,
  type = 'button',
  disabled = false
}: ButtonProps) => {
  const baseStyles = 'inline-block px-6 py-3 rounded-md font-medium transition-all duration-300 text-center';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
    light: 'bg-white text-blue-900 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
  };
  
  const buttonClasses = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {children}
      </Link>
    );
  }
  
  return (
    <button 
      className={buttonClasses} 
      onClick={onClick} 
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;