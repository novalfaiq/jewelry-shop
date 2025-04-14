import React from 'react';
import NavLink from '../atoms/NavLink';

type NavigationProps = {
  className?: string;
};

const Navigation = ({ className = '' }: NavigationProps) => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`flex items-center space-x-1 ${className}`}>
      {navItems.map((item) => (
        <NavLink 
          key={item.label} 
          href={item.href}
          active={item.href === '/'} // This would be dynamic in a real app
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;