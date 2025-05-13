'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

interface CartItem {
  id: string;
  recipeId: string;
  quantity: number;
  price: number;
  name?: string;
}

interface CheckoutForm {
  deliveryMethod: 'delivery' | 'pickup';
  address: string;
  phoneNumber: string;
  paymentMethod: 'card' | 'cash';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const t = useTranslations('Checkout');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    deliveryMethod: 'delivery',
    address: '',
    phoneNumber: '',
    paymentMethod: 'card',
  });

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

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate form
      if (form.deliveryMethod === 'delivery' && !form.address) {
        alert(t('addressRequired'));
        return;
      }
      if (!form.phoneNumber) {
        alert(t('phoneRequired'));
        return;
      }
      if (form.paymentMethod === 'card') {
        if (!form.cardNumber || !form.cardExpiry || !form.cardCvc) {
          alert(t('cardDetailsRequired'));
          return;
        }
      }

      // Create order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: calculateTotal(),
          address: form.address,
          phoneNumber: form.phoneNumber,
          deliveryMethod: form.deliveryMethod,
          paymentMethod: form.paymentMethod,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');

      // Redirect to success page
      router.push('/order-success');
    } catch (error) {
      console.error('Error creating order:', error);
      alert(t('orderError'));
    } finally {
      setSubmitting(false);
    }
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

  if (cartItems.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          {t('checkout')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Delivery Method */}
          <Card>
            <CardHeader>
              <CardTitle>{t('deliveryMethod')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={form.deliveryMethod}
                onValueChange={(value: 'delivery' | 'pickup') =>
                  setForm({ ...form, deliveryMethod: value })
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">{t('delivery')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">{t('pickup')}</Label>
                </div>
              </RadioGroup>

              {form.deliveryMethod === 'delivery' && (
                <div className="mt-4">
                  <Label htmlFor="address">{t('address')}</Label>
                  <Input
                    id="address"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('contactInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>{t('paymentMethod')}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={form.paymentMethod}
                onValueChange={(value: 'card' | 'cash') =>
                  setForm({ ...form, paymentMethod: value })
                }
                className="space-y-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">{t('card')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">{t('cash')}</Label>
                </div>
              </RadioGroup>

              {form.paymentMethod === 'card' && (
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">{t('cardNumber')}</Label>
                    <Input
                      id="cardNumber"
                      value={form.cardNumber}
                      onChange={(e) => setForm({ ...form, cardNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cardExpiry">{t('cardExpiry')}</Label>
                      <Input
                        id="cardExpiry"
                        placeholder="MM/YY"
                        value={form.cardExpiry}
                        onChange={(e) => setForm({ ...form, cardExpiry: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardCvc">{t('cardCvc')}</Label>
                      <Input
                        id="cardCvc"
                        value={form.cardCvc}
                        onChange={(e) => setForm({ ...form, cardCvc: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-gray-600 dark:text-gray-400"
                  >
                    <span>
                      {item.name || `Recipe #${item.recipeId}`} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-gray-100">
                    <span>{t('total')}</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('processing')}
              </>
            ) : (
              t('placeOrder')
            )}
          </Button>
        </form>
      </div>
    </div>
  );
} 