'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Container from '@/components/atoms/Container';
import Heading from '@/components/atoms/Heading';
import Header from '@/components/molecules/Header';
import Footer from '@/components/organisms/Footer';
import Newsletter from '@/components/organisms/Newsletter';

type ProductType = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  product_type_id: string;
  image_url: string | null;
  created_at: string;
  product_type?: ProductType;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_type:product_types(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Container>
            <div className="min-h-[60vh] flex items-center justify-center">
              <p className="text-lg">Loading products...</p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Container>
            <div className="min-h-[60vh] flex items-center justify-center">
              <p className="text-red-500 text-lg">Error: {error}</p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-900 py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Heading level={1} className="mb-6">Our Collection</Heading>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Discover our exquisite collection of fine jewelry, each piece crafted with precision and passion
              </p>
            </div>
          </Container>
        </section>

        {/* Products Grid */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-col md:flex-row h-full">
                    <div className="w-full md:w-1/2 relative">
                      <div className="aspect-square">
                        <img
                          src={product.image_url || '/blue-ring.png'}
                          alt={product.name}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 flex flex-col p-6">
                      <CardContent className="flex-grow p-0">
                        <h3 className="text-xl font-semibold text-blue-900 mb-3">{product.name}</h3>
                        <p className="text-gray-700 mb-3">{product.description}</p>
                        <p className="text-gray-600">Category: {product.product_type?.name}</p>
                      </CardContent>
                      <CardFooter className="px-0 pt-4 border-t flex justify-between items-center">
                        <span className="text-2xl font-bold text-blue-900">
                          ${product.price.toFixed(2)}
                        </span>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products available at the moment.</p>
              </div>
            )}
          </Container>
        </section>

        {/* <Newsletter /> */}
      </main>
      <Footer />
    </div>
  );
} 