import React from 'react';
import Heading from '../atoms/Heading';
import Button from '../atoms/Button';

type HeroContentProps = {
  className?: string;
};

const HeroContent = ({ className = '' }: HeroContentProps) => {
  return (
    <div className={`max-w-xl ${className}`}>
      <Heading level={1} className="text-white mb-4">
        Timeless Elegance, Modern Design
      </Heading>
      <p className="text-white/90 text-lg mb-8">
        Discover our exquisite collection of handcrafted jewelry pieces that blend traditional craftsmanship with contemporary style.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button href="/shop" variant="light">
          Shop Collection
        </Button>
        <Button href="/about" variant="secondary" className="text-white border-white hover:bg-white/10 shadow-md">
          Our Story
        </Button>
      </div>
    </div>
  );
};

export default HeroContent;