import React from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';
import Button from '../atoms/Button';
import Image from 'next/image';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

type Product = {
  id: string;
  name: string;
  image_url: string | null;
};

interface LatestJewelryProps {
  limit?: number | null;
}

async function getLatestProducts(limit?: number | null) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  let query = supabase
    .from('products')
    .select('id, name, image_url')
    .order('created_at', { ascending: false });

  if (limit !== null && limit !== undefined) {
    query = query.limit(limit);
  }

  const { data: products } = await query;
  return products || [];
}

const LatestJewelry = async ({ limit = 3 }: LatestJewelryProps) => {
  const products = await getLatestProducts(limit);

  return (
    <section className="py-16 bg-white">
      <Container>
        <Heading level={2} className="text-blue-900 text-center mb-10">
          OUR LATEST JEWELRY
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <Image
                  src={product.image_url || '/blue-ring.png'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button 
            href="/products" 
            variant="primary" 
            className="uppercase text-sm bg-blue-900 hover:bg-blue-800"
          >
            VIEW ALL
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default LatestJewelry;