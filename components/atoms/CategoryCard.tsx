import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type CategoryCardProps = {
  title: string;
  imageSrc: string;
  href: string;
  className?: string;
};

const CategoryCard = ({ title, imageSrc, href, className = '' }: CategoryCardProps) => {
  return (
    <Link 
      href={href}
      className={`block group transition-transform hover:scale-105 ${className}`}
    >
      <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
        <div className="aspect-square relative">
          <Image
            src={imageSrc}
            alt={`${title} category`}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-3 text-center bg-white">
          <h3 className="text-blue-900 font-medium uppercase tracking-wider text-sm">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;