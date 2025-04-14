import React from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';
import Button from '../atoms/Button';
import Image from 'next/image';

type JewelryItem = {
  id: string;
  imageSrc: string;
  alt: string;
};

const jewelryItems: JewelryItem[] = [
  {
    id: 'necklace',
    imageSrc: '/latest-jewelry/necklaces.png',
    alt: 'Gold necklace with pendant',
  },
  {
    id: 'necklace',
    imageSrc: '/latest-jewelry/necklaces-2.png',
    alt: 'Man Necklace',
  },
  {
    id: 'earring',
    imageSrc: '/latest-jewelry/earrings.png',
    alt: 'Diamond stud earrings',
  },
];

const LatestJewelry = () => {
  return (
    <section className="py-16 bg-white">
      <Container>
        <Heading level={2} className="text-blue-900 text-center mb-10">
          OUR LATEST JEWELRY
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {jewelryItems.map((item) => (
            <div key={item.id} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <Image
                  src={item.imageSrc}
                  alt={item.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            href="/shop" 
            variant="primary" 
            className="uppercase text-sm bg-blue-900 hover:bg-blue-800"
          >
            VIEW ALL
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default LatestJewelry;