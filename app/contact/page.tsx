'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Container from '@/components/atoms/Container';
import Heading from '@/components/atoms/Heading';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Button from '@/components/atoms/Button';
import { useForm } from 'react-hook-form';
import Header from '@/components/molecules/Header';
import Footer from '@/components/organisms/Footer';
import Image from 'next/image';

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('contact_messages')
        .insert([{
          name: data.name,
          email: data.email,
          subject: data.subject,
          message: data.message,
          status: 'new'
        }]);

      if (error) throw error;

      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-900 py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Heading level={1} className="mb-6">Contact Us</Heading>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                We're here to help with all your jewelry needs
              </p>
            </div>
          </Container>
        </section>

        {/* Contact Form Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Information */}
              <div>
                <Heading level={2} className="text-gray-900 mb-6">Get in Touch</Heading>
                <p className="text-gray-700 mb-8">
                  Whether you have questions about our collections, services, or need assistance with a purchase, 
                  our team is here to help. Fill out the form, and we'll get back to you as soon as possible.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-700">+1 (234) 567-8900</p>
                      <p className="text-gray-600 text-sm">Mon-Fri from 8am to 6pm</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-700">info@baysidejewelry.com</p>
                      <p className="text-gray-600 text-sm">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-700">123 Jewelry Lane</p>
                      <p className="text-gray-600 text-sm">San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-8 rounded-lg">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">Name</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field}
                              className="bg-white text-gray-900 border-gray-200 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your@email.com" 
                              {...field}
                              className="bg-white text-gray-900 border-gray-200 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">Subject</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="What's this about?" 
                              {...field}
                              className="bg-white text-gray-900 border-gray-200 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-900">Message</FormLabel>
                          <FormControl>
                            <textarea
                              className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                              placeholder="Your message..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-600" />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>

                    {submitStatus === 'success' && (
                      <div className="p-4 bg-green-50 text-green-700 rounded-md">
                        Thank you for your message! We'll get back to you soon.
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="p-4 bg-red-50 text-red-700 rounded-md">
                        There was an error sending your message. Please try again later.
                      </div>
                    )}
                  </form>
                </Form>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
} 