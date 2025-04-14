import React from 'react';
import Container from '../atoms/Container';
import Heading from '../atoms/Heading';

type Review = {
  id: string;
  quote: string;
  author: string;
};

const reviews: Review[] = [
  {
    id: 'review1',
    quote: 'The range of rich and amazing custom jewelry designs is what keeps me coming back. The quality is exceptional and the service is top-notch.',
    author: 'Alex Parker',
  },
  {
    id: 'review2',
    quote: 'I was amazed by the beautiful craftsmanship of my new ring. The attention to detail is truly remarkable and the quality is outstanding.',
    author: 'Tracy Wells',
  },
  {
    id: 'review3',
    quote: 'Elegant, stylish, and modern rings you can\'t find anywhere else. I ordered a custom ring and received incredible service.',
    author: 'Katrina Roberts',
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <Heading level={2} className="text-blue-900 text-center mb-10">
          CUSTOMER REVIEWS
        </Heading>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 shadow-sm rounded-lg">
              <div className="text-blue-900 text-4xl font-serif mb-4">"</div>
              <p className="text-gray-700 mb-4">{review.quote}</p>
              <p className="text-blue-900 font-medium">{review.author}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default CustomerReviews;