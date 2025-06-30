'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Header from '@/components/molecules/Header';
import Footer from '@/components/organisms/Footer';
import Container from '@/components/atoms/Container';
import Heading from '@/components/atoms/Heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CustomerReviews from '@/components/organisms/CustomerReviews';

export default function ReviewsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    review: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            content: formData.review,
            status: 'pending' // pending, approved, rejected
          }
        ]);

      if (error) throw error;

      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your review! It will be visible after approval.'
      });
      setFormData({ name: '', email: '', review: '' });
    } catch (error: any) {
      setSubmitStatus({
        type: 'error',
        message: 'Failed to submit review. Please try again.'
      });
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="bg-blue-900 py-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Heading level={1} className="text-3xl md:text-4xl font-semibold mb-4">
                Customer Reviews
              </Heading>
              <p className="text-base md:text-lg text-blue-100">
                Share your experience with our jewelry and services
              </p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-2xl mx-auto">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <Heading level={2} className="text-2xl md:text-3xl text-blue-900 mb-6 text-center">
                  Write a Review
                </Heading>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="mt-1 text-base px-3 py-2 h-auto"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="mt-1 text-base px-3 py-2 h-auto"
                    />
                  </div>

                  <div>
                    <Label htmlFor="review" className="text-sm font-medium text-gray-700">
                      Your Review
                    </Label>
                    <textarea
                      id="review"
                      value={formData.review}
                      onChange={(e) => setFormData(prev => ({ ...prev, review: e.target.value }))}
                      required
                      className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-auto w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-black min-h-[100px]"
                      rows={4}
                    />
                  </div>

                  {submitStatus.type && (
                    <div className={`p-4 rounded text-sm ${
                      submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {submitStatus.message}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-900 hover:bg-blue-800 text-base h-auto py-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </div>
            </div>
          </Container>
        </section>

        <CustomerReviews />
      </main>
      <Footer />
    </div>
  );
} 