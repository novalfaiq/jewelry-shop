'use client';

import React, { useEffect, useState } from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';
import { createClient } from '@/utils/supabase/client';

type Review = {
  id: string;
  name: string;
  content: string;
  created_at: string;
};

type CustomerReviewsProps = {
  limit?: number | null;
};

const CustomerReviews = ({ limit }: CustomerReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const supabase = createClient();
        let query = supabase
          .from('reviews')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (limit !== null && limit !== undefined) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setReviews(data || []);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [limit]);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <Heading level={2} className="text-blue-900 text-center mb-10">
            CUSTOMER REVIEWS
          </Heading>
          <div className="text-center">Loading reviews...</div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <Container>
          <Heading level={2} className="text-blue-900 text-center mb-10">
            CUSTOMER REVIEWS
          </Heading>
          <div className="text-center text-red-600">Failed to load reviews</div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <Heading level={2} className="text-blue-900 text-center mb-10">
          CUSTOMER REVIEWS
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 shadow-sm rounded-lg h-[300px] flex flex-col">
              <div className="text-blue-900 text-4xl font-serif mb-4">"</div>
              <div className="flex-grow overflow-hidden">
                <p className="text-gray-700 line-clamp-5">{review.content}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-blue-900 font-medium">{review.name}</p>
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">No reviews available yet.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default CustomerReviews;