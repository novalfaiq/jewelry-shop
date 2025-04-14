import React from 'react';
import Header from '../molecules/Header';
import HeroContent from '../molecules/HeroContent';
import Container from '../atoms/Container';
import Image from 'next/image';

const Hero = () => {
  return (
    <section className="relative min-h-screen">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/jewelry-hand.png"
          alt="Jewelry on hand"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-800/70 to-black/60" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <Header />
        
        <Container className="flex-1 flex items-center">
          <HeroContent />
        </Container>
      </div>
    </section>
  );
};

export default Hero;