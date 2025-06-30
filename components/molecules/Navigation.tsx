import React, { useState } from 'react';
import NavLink from '../atoms/NavLink';

type NavigationProps = {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
};

const Navigation = ({ className = '', isOpen = false, onClose }: NavigationProps) => {
  const navItems = [{ label: 'Home', href: '/' },{ label: 'Products', href: '/products' },{ label: 'Services', href: '/services' },{ label: 'Reviews', href: '/reviews' },{ label: 'About', href: '/about' },{ label: 'Contact', href: '/contact' }];

  return (
    <>
      <nav className={`hidden md:flex md:items-center md:space-x-4 ${className}`}>
        {navItems.map((item) => (
          <NavLink key={item.label} href={item.href} active={item.href === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <nav className={`md:hidden fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center space-y-4 transform ${isOpen ? 'translate-x-0' : 'translate-x-full pointer-events-none'} transition-transform duration-300 ease-in-out`}>
        {isOpen && (
          <button onClick={onClose} className="absolute top-4 right-4 text-white" aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {navItems.map((item) => (
          <NavLink key={item.label} href={item.href} active={item.href === '/'} className="text-xl py-2">
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

export default Navigation;