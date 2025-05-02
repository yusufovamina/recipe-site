"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderPage() {
  const [cart, setCart] = useState<{ id: number; name: string; price: number; quantity: number }[]>([]);
  const [deliveryOption, setDeliveryOption] = useState("delivery");
  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveryOption === "delivery" && !address) {
      alert("Please enter your delivery address!");
      return;
    }
    localStorage.removeItem("cart");
    router.push("/thank-you");
  };

  const updateQuantity = (id: number, change: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
    ));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-16 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-12">Checkout</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">Your cart is empty!</p>
      ) : (
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-800 dark:text-gray-100">{item.name}</span>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-gray-800 dark:text-gray-100">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  +
                </button>
                <span className="text-orange-500">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
          <div className="mt-4 text-xl font-bold text-gray-800 dark:text-gray-100">
            Total: ${total.toFixed(2)}
          </div>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300">Delivery Option</label>
              <select
                value={deliveryOption}
                onChange={(e) => setDeliveryOption(e.target.value)}
                className="w-full p-2 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
            {deliveryOption === "delivery" && (
              <div className="mb-4">
                <label className="block text-gray-700 dark:text-gray-300">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 mt-1 bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg"
                  placeholder="Enter delivery address"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Place Order
            </button>
          </form>
        </div>
      )}
    </div>
  );
}