'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';
import AdminSidebar from '@/components/molecules/AdminSidebar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Review = {
  id: string;
  name: string;
  email: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function ReviewsManagement() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
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
      fetchReviews();
    }
  }, [loading]);

  const fetchReviews = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      setError(error.message);
    }
  };

  const handleStatusChange = async (reviewId: string, newStatus: 'approved' | 'rejected') => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .update({ status: newStatus })
        .eq('id', reviewId);

      if (error) throw error;
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === reviewId ? { ...review, status: newStatus } : review
      ));
    } catch (error: any) {
      console.error('Error updating review status:', error);
      setError(error.message);
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      
      // Update local state
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error: any) {
      console.error('Error deleting review:', error);
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <AdminSidebar onSignOut={handleSignOut} />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="mb-8">
            <Heading level={2} className="text-blue-900">
              Reviews Management
            </Heading>
            <p className="text-gray-600">
              Welcome, {user?.email}
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Reviews List</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-4 mb-4 bg-red-100 text-red-700 rounded">
                  <p><strong>Error:</strong> {error}</p>
                </div>
              )}
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{review.name}</h3>
                        <p className="text-sm text-gray-500">{review.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-sm ${getStatusBadgeClass(review.status)}`}>
                        {review.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{review.content}</p>
                    <div className="flex gap-2">
                      {review.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleStatusChange(review.id, 'approved')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleStatusChange(review.id, 'rejected')}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => handleDelete(review.id)}
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <p className="text-center py-4 text-gray-500">
                    No reviews found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 