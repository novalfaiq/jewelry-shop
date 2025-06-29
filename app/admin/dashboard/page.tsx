'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push('/admin/login');
        return;
      }
      
      setUser(data.session.user);
      setLoading(false);
    };
    
    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-blue-900 text-white p-4 flex flex-col">
          <div className="mb-8">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              <li>
                <button 
                  className="w-full text-left px-4 py-2 rounded transition-colors bg-blue-800"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => router.push('/admin/newsletter')} 
                  className="w-full text-left px-4 py-2 rounded transition-colors hover:bg-blue-800"
                >
                  Newsletter
                </button>
              </li>
            </ul>
          </nav>
          
          <div className="mt-auto">
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full bg-transparent border-white text-white hover:bg-blue-800"
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <Heading level={2} className="text-blue-900">
              Dashboard Overview
            </Heading>
            <p className="text-gray-600">
              Welcome, {user?.email}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard 
              title="Products" 
              count="24" 
              href="/admin/products"
            />
            <DashboardCard 
              title="Orders" 
              count="12" 
              href="/admin/orders"
            />
            <DashboardCard 
              title="Customers" 
              count="48" 
              href="/admin/customers"
            />
            <DashboardCard 
              title="Newsletter Subscribers" 
              count="Manage"
              href="/admin/newsletter"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  count: string;
  href: string;
};

function DashboardCard({ title, count, href }: DashboardCardProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-3xl font-bold text-blue-900 my-2">{count}</p>
      <Button asChild className="mt-2 w-full">
        <a href={href}>View All</a>
      </Button>
    </div>
  );
}