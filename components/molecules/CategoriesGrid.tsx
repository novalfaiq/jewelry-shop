import React from 'react';
import CategoryCard from '../atoms/CategoryCard';

type Category = {
  id: string;
  title: string;
  imageSrc: string;
  href: string;
};

type CategoriesGridProps = {
  categories: Category[];
  className?: string;
};

const CategoriesGrid = ({ categories, className = '' }: CategoriesGridProps) => {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 ${className}`}>
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          title={category.title}
          imageSrc={category.imageSrc}
          href={category.href}
        />
      ))}
    </div>
  );
};

export default CategoriesGrid;