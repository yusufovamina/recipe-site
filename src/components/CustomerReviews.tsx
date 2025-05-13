'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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
    <div className="bg-gray-50 dark:bg-gray-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-300">
            Hear from our satisfied customers about their experience with us
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            <div className="relative h-80 overflow-hidden">
              {reviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  className={`absolute w-full transform ${idx === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: idx === activeIndex ? 1 : 0,
                    y: idx === activeIndex ? 0 : 20
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <div className="relative">
                      <img
                        className="h-24 w-24 rounded-full mx-auto"
                        src={review.avatar}
                        alt={`${review.name}'s avatar`}
                      />
                      <span className="absolute bottom-0 right-0 inline-block">
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </span>
                    </div>
                    <div className="mt-6">
                      <p className="text-xl font-medium text-gray-900 dark:text-white">
                        {review.name}
                      </p>
                      <p className="mt-3 text-base text-gray-500 dark:text-gray-300 max-w-2xl mx-auto">
                        "{review.comment}"
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-center space-x-3">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  className={`h-3 w-3 rounded-full ${
                    idx === activeIndex
                      ? 'bg-orange-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                  onClick={() => setActiveIndex(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 