import React from 'react';
import Logo from '../atoms/Logo';
import Navigation from './Navigation';
import Container from '../atoms/Container';
import Image from 'next/image';

type HeaderProps = {
  className?: string;
};

const Header = ({ className = '' }: HeaderProps) => {
  return (
    <header className={`py-4 ${className}`}>
      <Container>
        <div className="flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center space-x-4">
            <Navigation />
            <div className="ml-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-white"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
          </div>
          <button className="md:hidden" aria-label="Menu">
            {/* Mobile menu button - would be expanded in a real implementation */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </Container>
    </header>
  );
};

export default Header;