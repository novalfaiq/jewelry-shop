import React from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';
import Button from '../atoms/Button';
import Image from 'next/image';

type Service = {
  id: string;
  title: string;
  imageSrc: string;
  alt: string;
};

const services: Service[] = [
  {
    id: 'repair',
    title: 'JEWELRY REPAIR',
    imageSrc: '/services/jewelry-repair.png', // Using existing images as placeholders
    alt: 'Jewelry repair service',
  },
  {
    id: 'sizing',
    title: 'RING SIZING',
    imageSrc: '/services/ring-sizing.png',
    alt: 'Ring sizing service',
  },
  {
    id: 'polishing',
    title: 'JEWELRY POLISHING',
    imageSrc: '/services/jewelry-polishing.png',
    alt: 'Jewelry polishing service',
  },
];

const OurServices = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <Heading level={2} className="text-blue-900 text-center mb-10">
          OUR SERVICES
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="text-center">
              <div className="aspect-square relative mb-4 max-w-[250px] mx-auto">
                <Image
                  src={service.imageSrc}
                  alt={service.alt}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-blue-900 font-semibold text-lg mb-2">{service.title}</h3>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            href="/services" 
            variant="primary" 
            className="uppercase text-sm bg-blue-900 hover:bg-blue-800"
          >
            LEARN MORE
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default OurServices;