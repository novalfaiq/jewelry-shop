'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

type AdminSidebarProps = {
  onSignOut: () => void;
};

export default function AdminSidebar({ onSignOut }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Newsletter', path: '/admin/newsletter' },
    { name: 'Product Types', path: '/admin/product-types' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Contact Messages', path: '/admin/contact' },
  ];

  return (
    <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button 
                onClick={() => item.path !== pathname ? router.push(item.path) : undefined} 
                className={`w-full text-left px-4 py-2 rounded transition-colors ${pathname === item.path ? 'bg-blue-800' : 'hover:bg-blue-800'}`}
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto">
        <Button 
          variant="outline" 
          onClick={onSignOut}
          className="w-full bg-transparent border-white text-white hover:bg-blue-800"
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}