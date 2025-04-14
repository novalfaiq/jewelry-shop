import React from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';
import CategoriesGrid from '../molecules/CategoriesGrid';

const categories = [
  {
    id: 'earrings',
    title: 'Earrings',
    imageSrc: '/categories/earrings.png',
    href: '/shop/earrings',
  },
  {
    id: 'necklaces',
    title: 'Necklaces',
    imageSrc: '/categories/necklaces.png',
    href: '/shop/necklaces',
  },
  {
    id: 'bracelets',
    title: 'Bracelets',
    imageSrc: '/categories/bracelets.png',
    href: '/shop/bracelets',
  },
  {
    id: 'rings',
    title: 'All Rings',
    imageSrc: '/categories/rings.png',
    href: '/shop/rings',
  },
  {
    id: 'engagement',
    title: 'Engagement Rings',
    imageSrc: '/categories/engagement.png',
    href: '/shop/engagement',
  },
];

const JewelryCategories = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <Heading level={2} className="text-blue-900 text-center mb-10">
          SHOP BY JEWELRY TYPE
        </Heading>
        <CategoriesGrid categories={categories} />
      </Container>
    </section>
  );
};

export default JewelryCategories;