'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function NewsletterManagement() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
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
      console.log('User authenticated, fetching newsletters');
      fetchNewsletters();
    }
  }, [loading]);
  
  const fetchNewsletters = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create client with utility function
      const supabase = createClient();
      
      // Try a simple query first
      const { data, error } = await supabase
        .from('newsletter')
        .select('*');
      
      console.log('Fetch result:', { 
        data, 
        error,
        dataType: typeof data,
        isArray: Array.isArray(data),
        length: data?.length
      });
      
      if (error) {
        console.error('Fetch error:', error);
        setError(`Fetch error: ${error.message}`);
      }
      
      // Always add a dummy record for testing UI
      const dummyRecord = {
        id: 'dummy-id-' + Date.now(),
        email: `test-${Date.now()}@example.com`,
        subscribed_at: new Date().toISOString()
      };
      
      // Combine real data with dummy data
      const realData = (data && Array.isArray(data)) ? data : [];
      const finalData = [...realData];
      
      console.log('Final data to display (with dummy record):', finalData);
      setNewsletters(finalData);
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError(`Unexpected error: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };
  
  const handleAddNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletter')
        .insert([{ email: newEmail }]);
        
      if (error) throw error;
      setNewEmail('');
      fetchNewsletters();
    } catch (error) {
      console.error('Error adding newsletter:', error);
    }
  };
  
  const handleDeleteNewsletter = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('newsletter')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      fetchNewsletters();
    } catch (error) {
      console.error('Error deleting newsletter:', error);
    }
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
                  onClick={() => router.push('/admin/dashboard')} 
                  className="w-full text-left px-4 py-2 rounded transition-colors hover:bg-blue-800"
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-4 py-2 rounded transition-colors bg-blue-800"
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
              Newsletter Management
            </Heading>
            <p className="text-gray-600">
              Welcome, {user?.email}
            </p>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Subscriber</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddNewsletter} className="flex gap-4">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button type="submit">Add Subscriber</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscribers List</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                    <p><strong>Error:</strong> {error}</p>
                  </div>
                )}
                
                {isLoading ? (
                  <p>Loading subscribers...</p>
                ) : (
                  <div>
                    <h3 className="font-bold mb-2">Newsletter List:</h3>
                    <ul className="list-disc pl-5 mb-4">
                      {newsletters && newsletters.length > 0 ? (
                        newsletters.map((newsletter, index) => (
                          <li key={newsletter.id || `newsletter-${index}`} className="mb-2">
                            <strong>Email:</strong> {newsletter.email || 'No email'}<br />
                            <strong>Date:</strong> {newsletter.subscribed_at ? new Date(newsletter.subscribed_at).toLocaleDateString() : 'No date'}<br />
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => newsletter.id && handleDeleteNewsletter(newsletter.id)}
                              className="mt-1 text-red-600 hover:text-red-800"
                              disabled={!newsletter.id}
                            >
                              Delete
                            </Button>
                          </li>
                        ))
                      ) : (
                        <li>No subscribers found</li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}