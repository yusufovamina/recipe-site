"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email, message });
    setName("");
    setEmail("");
    setMessage("");
    alert("Thank you for your message!");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Contact Us</h1>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Phone: +1-123-456-7890
        </p>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Email: info@restaurant.com
        </p>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}