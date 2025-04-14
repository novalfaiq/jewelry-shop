import React from 'react';
import Link from 'next/link';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
};

const NavLink = ({ href, children, className = '', active = false }: NavLinkProps) => {
  const baseStyles = 'px-3 py-2 text-white transition-colors duration-300';
  const activeStyles = active ? 'font-medium' : 'hover:text-blue-300';
  
  return (
    <Link href={href} className={`${baseStyles} ${activeStyles} ${className}`}>
      {children}
    </Link>
  );
};

export default NavLink;