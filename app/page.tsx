import Hero from '../components/organisms/Hero';
import JewelryCategories from '../components/organisms/JewelryCategories';
import Craftsmanship from '../components/organisms/Craftsmanship';
import LatestJewelry from '@/components/organisms/LatestJewelry';
import CustomerReviews from '../components/organisms/CustomerReviews';
import OurServices from '../components/organisms/OurServices';
import Newsletter from '../components/organisms/Newsletter';
import Footer from '../components/organisms/Footer';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

async function getLatestProducts() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: products } = await supabase
    .from('products')
    .select('id, name, image_url')
    .order('created_at', { ascending: false })
    .limit(3);
  
  return products || [];
}

export default async function Home() {
  const latestProducts = await getLatestProducts();

  return (
    <div>
      <main>
        <Hero />
        <JewelryCategories />
        <LatestJewelry limit={3} />
        <Craftsmanship />
        <OurServices />
        <CustomerReviews limit={3} />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
