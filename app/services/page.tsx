import React from 'react';
import Container from '@/components/atoms/Container';
import Heading from '@/components/atoms/Heading';
import Image from 'next/image';
import Footer from '@/components/organisms/Footer';
import Header from '@/components/molecules/Header';
import Button from '@/components/atoms/Button';

type ServiceDetail = {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  alt: string;
  features: string[];
};

const serviceDetails: ServiceDetail[] = [
  {
    id: 'repair',
    title: 'JEWELRY REPAIR',
    description: 'Our expert craftsmen can restore your treasured jewelry pieces to their original beauty. From fixing broken clasps to resetting stones, we handle all types of repairs with precision and care.',
    imageSrc: '/services/jewelry-repair.png',
    alt: 'Jewelry repair service',
    features: [
      'Chain soldering and repair',
      'Clasp replacement and repair',
      'Stone replacement and resetting',
      'Prong retipping and rebuilding',
      'Rhodium plating and refinishing'
    ]
  },
  {
    id: 'sizing',
    title: 'RING SIZING',
    description: 'Get the perfect fit for your rings with our professional sizing service. Whether you need your ring sized up or down, our experts ensure a comfortable fit while maintaining the integrity of your piece.',
    imageSrc: '/services/ring-sizing.png',
    alt: 'Ring sizing service',
    features: [
      'Precise measurements for accurate sizing',
      'Same-day service available for simple adjustments',
      'Sizing for all metal types',
      'Preservation of engravings and patterns',
      'Complimentary cleaning and polishing with every sizing'
    ]
  },
  {
    id: 'polishing',
    title: 'JEWELRY POLISHING',
    description: 'Restore the shine and luster of your jewelry with our professional polishing services. Our specialized techniques remove scratches, tarnish, and dullness to make your pieces look like new again.',
    imageSrc: '/services/jewelry-polishing.png',
    alt: 'Jewelry polishing service',
    features: [
      'Ultrasonic cleaning to remove dirt and residue',
      'Professional steam cleaning',
      'Hand polishing for delicate pieces',
      'Rhodium plating for white gold',
      'Anti-tarnish treatment'
    ]
  },
  {
    id: 'custom',
    title: 'CUSTOM DESIGN',
    description: 'Create a one-of-a-kind piece that tells your unique story. Our design team works closely with you to bring your vision to life, from initial sketch to finished masterpiece.',
    imageSrc: '/craftman.png',
    alt: 'Custom jewelry design service',
    features: [
      'Personal consultation with our design team',
      '3D modeling and rendering',
      'Selection of ethically sourced gemstones and metals',
      'Handcrafting by master jewelers',
      'Lifetime warranty on all custom pieces'
    ]
  },
  {
    id: 'appraisal',
    title: 'JEWELRY APPRAISAL',
    description: 'Get an accurate valuation of your jewelry for insurance, estate planning, or resale purposes. Our certified gemologists provide detailed appraisals based on current market values.',
    imageSrc: '/jewelry-hand.png',
    alt: 'Jewelry appraisal service',
    features: [
      'Comprehensive written appraisals',
      'Gemstone identification and grading',
      'Metal testing and verification',
      'Digital documentation with photographs',
      'Insurance replacement value assessment'
    ]
  },
  {
    id: 'cleaning',
    title: 'PROFESSIONAL CLEANING',
    description: 'Keep your jewelry looking its best with our professional cleaning services. Regular maintenance helps preserve the beauty and integrity of your precious pieces.',
    imageSrc: '/blue-ring.png',
    alt: 'Professional jewelry cleaning service',
    features: [
      'Deep ultrasonic cleaning',
      'Inspection of settings and stones',
      'Minor adjustments and tightening',
      'Final polish and steam',
      'Complimentary consultation on care and maintenance'
    ]
  }
];

export default function Services() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-blue-900 py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Heading level={1} className="mb-6">Our Services</Heading>
              <p className="text-lg md:text-xl text-blue-100 mb-8">
                Expert care for your precious jewelry pieces
              </p>
            </div>
          </Container>
        </section>

        {/* Services Overview */}
        <section className="py-16 bg-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <Heading level={2} className="text-gray-900 mb-6">Comprehensive Jewelry Services</Heading>
              <p className="text-gray-700">
                At Bayside Fine Jewelry, we offer a complete range of professional services to care for your precious pieces. 
                From repairs and resizing to custom design and appraisals, our expert craftsmen handle your jewelry with the utmost care and precision.
              </p>
            </div>

            {/* Service Cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {serviceDetails.slice(0, 3).map((service) => (
                <div key={service.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-square relative">
                    <Image 
                      src={service.imageSrc} 
                      alt={service.alt} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">{service.title}</h3>
                    <p className="text-gray-700 mb-4">{service.description}</p>
                    <a href={`#${service.id}`} className="text-blue-900 font-medium hover:text-blue-700 transition-colors">
                      Learn more →
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {serviceDetails.slice(3).map((service) => (
                <div key={service.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm transition-all hover:shadow-md">
                  <div className="aspect-square relative">
                    <Image 
                      src={service.imageSrc} 
                      alt={service.alt} 
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">{service.title}</h3>
                    <p className="text-gray-700 mb-4">{service.description}</p>
                    <a href={`#${service.id}`} className="text-blue-900 font-medium hover:text-blue-700 transition-colors">
                      Learn more →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Detailed Service Sections */}
        {serviceDetails.map((service, index) => (
          <section 
            id={service.id} 
            key={service.id} 
            className={`py-16 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
          >
            <Container>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {index % 2 === 0 ? (
                  <>
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                      <Image 
                        src={service.imageSrc} 
                        alt={service.alt} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Heading level={2} className="text-gray-900 mb-6">{service.title}</Heading>
                      <p className="text-gray-700 mb-6">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="h-6 w-6 text-blue-900 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Heading level={2} className="text-gray-900 mb-6">{service.title}</Heading>
                      <p className="text-gray-700 mb-6">{service.description}</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="h-6 w-6 text-blue-900 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="relative h-[400px] rounded-lg overflow-hidden">
                      <Image 
                        src={service.imageSrc} 
                        alt={service.alt} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  </>
                )}
              </div>
            </Container>
          </section>
        ))}

        {/* Call to Action */}
        <section className="py-16 bg-blue-900 text-white">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <Heading level={2} className="mb-6">Ready to Schedule a Service?</Heading>
              <p className="text-lg text-blue-100 mb-8">
                Contact us today to book an appointment or get a quote for any of our services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button href="/contact" variant="light" className="px-8">
                  CONTACT US
                </Button>
                <Button href="tel:+1234567890" variant="outline" className="px-8 border-white text-white hover:bg-white hover:text-blue-900">
                  CALL NOW
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </div>
  );
}