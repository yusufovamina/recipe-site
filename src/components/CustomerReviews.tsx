'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  type: 'taste' | 'delivery' | 'service';
}

const reviews: Review[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "/avatars/avatar1.png",
    rating: 5,
    comment: "The food is absolutely delicious! Every dish is bursting with flavor. My new favorite place!",
    type: 'taste'
  },
  {
    id: 2,
    name: "Mike Chen",
    avatar: "/avatars/avatar2.png",
    rating: 5,
    comment: "Lightning-fast delivery and the food arrives hot and fresh every time. Impressive service!",
    type: 'delivery'
  },
  {
    id: 3,
    name: "Emily Davis",
    avatar: "/avatars/avatar3.png",
    rating: 5,
    comment: "The staff is incredibly friendly and attentive. They make every visit special!",
    type: 'service'
  },
  {
    id: 4,
    name: "David Wilson",
    avatar: "/avatars/avatar4.png",
    rating: 5,
    comment: "Best quality ingredients and you can taste the difference. Worth every penny!",
    type: 'taste'
  }
];

export default function CustomerReviews() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gray-50 dark:bg-gray-800/50 py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 dark:text-gray-300">
            Hear from our satisfied customers about their experience with us
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="relative h-[400px] overflow-hidden">
            {reviews.map((review, idx) => (
              <motion.div
                key={review.id}
                className={`absolute w-full transform ${
                  idx === activeIndex ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: idx === activeIndex ? 1 : 0,
                  y: idx === activeIndex ? 0 : 20
                }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mx-4">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-500 ring-offset-4 dark:ring-offset-gray-800">
                        <img
                          src={review.avatar}
                          alt={`${review.name}'s avatar`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-500 rounded-full px-3 py-1">
                        <div className="flex items-center space-x-1">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-white fill-white" />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <blockquote className="text-center">
                      <p className="text-xl italic text-gray-700 dark:text-gray-300 mb-4">
                        "{review.comment}"
                      </p>
                      <footer>
                        <div className="font-medium text-lg text-gray-900 dark:text-white">
                          {review.name}
                        </div>
                        <div className="text-orange-500 font-medium mt-1">
                          {review.type.charAt(0).toUpperCase() + review.type.slice(1)} Review
                        </div>
                      </footer>
                    </blockquote>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center space-x-3 mt-8">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? 'bg-orange-500 w-8'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-orange-300 dark:hover:bg-orange-700'
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 