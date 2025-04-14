import React from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';
import Button from '../atoms/Button';
import Image from 'next/image';

const Newsletter = () => {
  return (
    <section className="py-16 bg-blue-100 relative overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-white">
          {/* Left side - Blue Ring Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image 
              src="/blue-ring.png" 
              alt="Blue diamond ring" 
              width={400} 
              height={400}
              className="object-contain"
            />
          </div>
          
          {/* Right side - Newsletter Content */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <Heading level={2} className="text-blue-900 mb-4">
              STAY IN TOUCH?
            </Heading>
            <p className="mb-8 text-gray-700">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto md:mx-0">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <Button 
                variant="primary" 
                className="bg-blue-900 text-white hover:bg-blue-800 uppercase text-sm"
              >
                SUBSCRIBE
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Newsletter;