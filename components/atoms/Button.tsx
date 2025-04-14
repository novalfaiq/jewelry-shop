import React from 'react';
import Link from 'next/link';

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
};

const Button = ({ 
  children, 
  href, 
  variant = 'primary', 
  className = '',
  onClick
}: ButtonProps) => {
  const baseStyles = 'inline-block px-6 py-3 rounded-md font-medium transition-all duration-300 text-center';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'border border-gray-300 hover:bg-gray-100'
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
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;