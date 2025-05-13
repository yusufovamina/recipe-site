'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';

interface CartItem {
  id: string;
  recipeId: string;
  quantity: number;
  price: number;
  name?: string;
  image?: string;
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('Cart');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      fetchCartItems();
    }
  }, [session]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`/api/cart?userId=${session?.user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch cart');
      const items = await response.json();
      setCartItems(items);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });
      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to remove item');
      fetchCartItems(); // Refresh cart items
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">{t('loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('yourCart')}
        </h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {t('emptyCart')}
                </p>
                <Button
                  onClick={() => router.push('/menu')}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {t('continueShopping')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('cartItems')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border-b dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {item.name || `Recipe #${item.recipeId}`}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('total')}
                  </span>
                  <span className="text-2xl font-bold text-orange-500">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  {t('proceedToCheckout')}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 