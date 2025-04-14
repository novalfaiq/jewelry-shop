import Hero from '../components/organisms/Hero';
import JewelryCategories from '../components/organisms/JewelryCategories';
import Craftsmanship from '../components/organisms/Craftsmanship';
import LatestJewelry from '../components/organisms/LatestJewelry';
import CustomerReviews from '../components/organisms/CustomerReviews';
import OurServices from '../components/organisms/OurServices';
import Newsletter from '../components/organisms/Newsletter';
import Footer from '../components/organisms/Footer';

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <JewelryCategories />
        <Craftsmanship />
        <LatestJewelry />
        <CustomerReviews />
        <OurServices />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
