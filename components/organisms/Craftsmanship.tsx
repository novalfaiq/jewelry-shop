import React from 'react';
import Container from '../atoms/Container';
import Button from '../atoms/Button';
import Image from 'next/image';

const Craftsmanship = () => {
  return (
    <section className="bg-white">
      <div className="flex flex-col md:flex-row">
        {/* Left side with blue background and text */}
        <div className="bg-blue-900 text-white p-8 md:p-12 flex flex-col justify-center md:w-1/2">
          <div className="max-w-md mx-auto md:ml-auto md:mr-0 md:pr-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">HAND CRAFTED<br />FINE PIECES.</h2>
            <p className="mb-8">
              We also firmly believed that our customers deserved more choices, straightforward
              information and legendary service.
            </p>
            <div>
              <Button href="/craftsmanship" variant="primary" className="bg-white text-blue-900 hover:bg-gray-100 uppercase text-sm">
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right side with image */}
        <div className="md:w-1/2 relative min-h-[350px] md:min-h-[400px]">
          <Image 
            src="/craftman.png" 
            alt="Jewelry craftsmanship" 
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Craftsmanship;