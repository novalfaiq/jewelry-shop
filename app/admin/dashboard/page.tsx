'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';
import AdminSidebar from '@/components/molecules/AdminSidebar';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const [productTypeCount, setProductTypeCount] = useState<number>(0);
  const [productCount, setProductCount] = useState<number>(0);
  const [contactMessageCount, setContactMessageCount] = useState<number>(0);
  const [customerReviewCount, setCustomerReviewCount] = useState<number>(0);
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
  
  useEffect(() => {
    if (!loading) {
      fetchSubscriberCount();
      fetchProductTypeCount();
      fetchProductCount();
      fetchContactMessageCount();
      fetchCustomerReviewCount();
    }
  }, [loading]);
  
  const fetchSubscriberCount = async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('newsletter')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching subscriber count:', error);
        return;
      }
      
      setSubscriberCount(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching subscriber count:', error);
    }
  };
  
  const fetchProductTypeCount = async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('product_types')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching product type count:', error);
        return;
      }
      
      setProductTypeCount(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching product type count:', error);
    }
  };
  
  const fetchProductCount = async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error fetching product count:', error);
        return;
      }
      
      setProductCount(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching product count:', error);
    }
  };

  const fetchContactMessageCount = async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching contact message count:', error);
        return;
      }

      setContactMessageCount(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching contact message count:', error);
    }
  };

  const fetchCustomerReviewCount = async () => {
    try {
      const supabase = createClient();
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching customer review count:', error);
        return;
      }

      setCustomerReviewCount(count || 0);
    } catch (error) {
      console.error('Unexpected error fetching customer review count:', error);
    }
  };

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
        <AdminSidebar onSignOut={handleSignOut} />
        
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
              title="Newsletter Subscribers" 
              count={subscriberCount.toString()}
              href="/admin/newsletter"
            />
            <DashboardCard 
              title="Product Types" 
              count={productTypeCount.toString()}
              href="/admin/product-types"
            />
            <DashboardCard 
              title="Products" 
              count={productCount.toString()}
              href="/admin/products"
            />
            <DashboardCard 
              title="Contact Messages" 
              count={contactMessageCount.toString()}
              href="/admin/contact"
            />
            <DashboardCard 
              title="Customer Reviews" 
              count={customerReviewCount.toString()}
              href="/admin/reviews"
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