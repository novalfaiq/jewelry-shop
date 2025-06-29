import React from 'react';
import Container from '@/components/atoms/Container';
import Heading from '@/components/atoms/Heading';
import Image from 'next/image';
import Footer from '@/components/organisms/Footer';
import Header from '@/components/molecules/Header';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-900 py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Heading level={1} className="mb-6">About Bayside Fine Jewelry</Heading>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Crafting timeless elegance with modern design since 1995
              </p>
            </div>
          </Container>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Heading level={2} className="text-gray-900 mb-6">Our Story</Heading>
                <p className="text-gray-700 mb-4">
                  Founded in 1995, Bayside Fine Jewelry began as a small family workshop dedicated to creating unique, handcrafted jewelry pieces. What started as a passion project quickly grew into a respected name in the jewelry industry.
                </p>
                <p className="text-gray-700 mb-4">
                  Our founder, Elizabeth Bayside, believed that jewelry should be more than just accessories—they should be heirlooms that tell stories and capture memories. This philosophy continues to guide our work today.
                </p>
                <p className="text-gray-700">
                  Over the decades, we've expanded our collections while maintaining our commitment to quality craftsmanship and ethical sourcing. Every piece that bears our name represents our dedication to excellence and artistry.
                </p>
              </div>
              <div className="relative h-[400px] rounded-lg overflow-hidden">
                <Image 
                  src="/craftman.png" 
                  alt="Jewelry craftsman at work" 
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <Heading level={2} className="text-gray-900 mb-12 text-center">Our Values</Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Craftsmanship</h3>
                <p className="text-gray-700">
                  We believe in creating jewelry that stands the test of time, both in style and durability. Each piece is meticulously crafted by skilled artisans using traditional techniques and modern innovation.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ethical Sourcing</h3>
                <p className="text-gray-700">
                  We are committed to responsible sourcing practices. All our gemstones and precious metals are ethically sourced, ensuring that our beautiful creations don't come at the expense of people or the planet.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Experience</h3>
                <p className="text-gray-700">
                  We believe in creating meaningful relationships with our customers. From personalized consultations to after-sales service, we strive to make every interaction with Bayside Fine Jewelry special and memorable.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-white">
          <Container>
            <Heading level={2} className="text-gray-900 mb-12 text-center">Meet Our Team</Heading>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-blue-200"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Elizabeth Bayside</h3>
                <p className="text-blue-900 mb-4">Founder & Lead Designer</p>
                <p className="text-gray-700">
                  With over 30 years of experience in jewelry design, Elizabeth brings unparalleled expertise and vision to our collections.
                </p>
              </div>
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-blue-200"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Chen</h3>
                <p className="text-blue-900 mb-4">Master Craftsman</p>
                <p className="text-gray-700">
                  Michael's attention to detail and precision craftsmanship ensures that every piece meets our exacting standards of quality.
                </p>
              </div>
              <div className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-blue-200"></div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sophia Rodriguez</h3>
                <p className="text-blue-900 mb-4">Gemologist</p>
                <p className="text-gray-700">
                  Sophia's expertise in gemstone selection ensures that only the finest stones make their way into our jewelry pieces.
                </p>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}