import React from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';
import CategoriesGrid from '../molecules/CategoriesGrid';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

type Category = {
  id: string;
  title: string;
  imageSrc: string;
  href: string;
};

async function getProductTypes() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: productTypes } = await supabase
    .from('product_types')
    .select('id, name, description, image_url')
    .order('name');

  // Transform the data to match the expected Category type
  const categories: Category[] = (productTypes || []).map((item) => ({
    id: item.id,
    title: item.name,
    imageSrc: item.image_url || `/categories/${item.name.toLowerCase().replace(/\s+/g, '-')}.png`,
    href: "products",
  }));

  return categories;
}

const JewelryCategories = async () => {
  const categories = await getProductTypes();

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <Heading level={2} className="text-blue-900 text-center mb-10">
          SHOP BY JEWELRY TYPE
        </Heading>
        <CategoriesGrid categories={categories} />
      </Container>
    </section>
  );
};

export default JewelryCategories;