import React from 'react';
import Container from '../atoms/Container';
import Logo from '../atoms/Logo';
import Link from 'next/link';

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Case Studies', href: '/case-studies' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-blue-100 py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-gray-600 hover:text-blue-900 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Copyright and Social media icons */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">  
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            © Blue Diamond Jewelry™ {new Date().getFullYear()}
          </p>
          
          {/* Social media icons */}
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="text-gray-800 hover:text-blue-900 bg-white rounded-full p-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-800 hover:text-blue-900 bg-white rounded-full p-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            <a href="#" aria-label="Pinterest" className="text-gray-800 hover:text-blue-900 bg-white rounded-full p-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="#" aria-label="Yelp" className="text-gray-800 hover:text-blue-900 bg-white rounded-full p-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 9.194 9.194 0 0 1 2.412 3.17 1.073 1.073 0 0 1-.742 1.541Zm-5.025 3.152 4.942 1.606c.94.306.674 1.654-.323 1.635-1.528-.026-3.040-.473-4.42-1.348a1.071 1.071 0 0 1-.307-1.634c.541-.643 1.505-.487 2.108-.259ZM8.761 20.97c-.792.21-1.644.195-2.428-.044-1.045-.32-.773-1.846.301-1.84 1.546.01 4.264-.656 4.9-1.149.638-.492 1.152.284 1.15.963-.006 1.085-2.214 1.667-3.923 2.07Zm-1.438-5.437c-1.424.033-2.84-.292-4.115-.944-.58-.297-.483-1.166.13-1.337l5.536-1.513c.806-.22 1.245.715.738 1.357l-1.632 2.204a1.07 1.07 0 0 1-.657.233ZM11.083 9.5l-2.384-5.182c-.33-.716.569-1.355 1.088-.772 1.257 1.41 2.288 3.07 2.987 4.930.193.512-.318 1.034-.822.834l-1.205-.345a1.071 1.071 0 0 1-.664-.465Z" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;