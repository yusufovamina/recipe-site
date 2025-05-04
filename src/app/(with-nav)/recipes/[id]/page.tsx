"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface MenuItem {
  id: string;
  img: string;
  name: string;
  dsc: string;
  price: number;
  rate: number;
  country: string;
}

async function getMenuItem(id: string): Promise<MenuItem | null> {
  try {
    const endpoints = [
      "/bbqs", "/best-foods", "/breads", "/burgers", "/chocolates", "/desserts", "/drinks",
      "/fried-chicken", "/ice-cream", "/pizzas", "/porks", "/sandwiches", "/sausages", "/steaks",
    ];

    for (const endpoint of endpoints) {
      const res = await fetch(`https://free-food-menus-api-two.vercel.app${endpoint}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) continue;
      const data = await res.json();
      const item = Object.values(data).flat().find((i: any) => i.id === id);
      if (item) return item as MenuItem;
    }
    return null;
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return null;
  }
}

export default function MenuItemDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      const menuItem = await getMenuItem(resolvedParams.id);
      setItem(menuItem);
    }
    fetchData();
  }, [resolvedParams.id]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: MenuItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCart([...cart, { id: item.id, name: item.name, price: item.price, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(cartItem => cartItem.id !== id));
  };

  if (!item) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-600 dark:text-gray-400">Item not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{item.name}</CardTitle>
          <p className="text-2xl font-bold text-orange-500 dark:text-orange-400 mt-2">
            ${item.price.toFixed(2)}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="secondary">{item.country}</Badge>
            <Badge variant="outline">Rating: {item.rate}/5</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-80 object-cover rounded-lg mb-6"
          />
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{item.dsc}</p>
          </div>
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => addToCart(item)}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Add to Cart
            </button>
            {cart.find(cartItem => cartItem.id === item.id) && (
              <button
                onClick={() => removeFromCart(item.id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}