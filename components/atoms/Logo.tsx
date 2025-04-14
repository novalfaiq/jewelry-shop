import React from 'react';
import Link from 'next/link';

type LogoProps = {
  className?: string;
};

const Logo = ({ className = '' }: LogoProps) => {
  return (
    <Link href="/" className={`text-white font-bold text-2xl ${className}`}>
      BAYSIDE FINE JEWELRY
    </Link>
  );
};

export default Logo;