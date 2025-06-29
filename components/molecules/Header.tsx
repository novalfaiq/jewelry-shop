'use client';
import React, { useState } from 'react';
import Container from '../atoms/Container';
import Logo from '../atoms/Logo';
import Navigation from './Navigation';

type HeaderProps = {
  className?: string;
};

const Header = ({ className = '' }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={`py-4 ${className}`}>
      <Container>
        <div className="flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center space-x-4">
            <Navigation />
          </div>
          <button 
            className="md:hidden" 
            aria-label="Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Navigation isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} className="md:hidden" />
        </div>
      </Container>
    </header>
  );
};

export default Header;