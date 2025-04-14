import React from 'react';

type HeadingProps = {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
};

const Heading = ({ level = 1, children, className = '' }: HeadingProps) => {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  
  const styles = {
    1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    2: 'text-3xl md:text-4xl font-bold',
    3: 'text-2xl md:text-3xl font-semibold',
    4: 'text-xl md:text-2xl font-semibold',
    5: 'text-lg md:text-xl font-medium',
    6: 'text-base md:text-lg font-medium'
  }[level];
  
  return (
    <Tag className={`${styles} ${className}`}>
      {children}
    </Tag>
  );
};

export default Heading;