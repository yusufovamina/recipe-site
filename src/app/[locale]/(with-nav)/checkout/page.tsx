"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/store/cartStore';
import { MapPin, CreditCard, Truck, Store, Phone } from 'lucide-react';

interface FormData {
  deliveryMethod: 'delivery' | 'pickup';
  address: string;
  phoneNumber: string;
  paymentMethod: 'card' | 'cash';
}

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const { data: session } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const { items, total, clearCart } = useCartStore();

  const [formData, setFormData] = useState<FormData>({
    deliveryMethod: 'delivery',
    address: '',
    phoneNumber: '',
    paymentMethod: 'card',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (formData.deliveryMethod === 'delivery' && !formData.address) {
      newErrors.address = 'Address is required for delivery';
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const payload = {
        items: items.map(item => ({
          recipeId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        address: formData.deliveryMethod === 'pickup' ? 'Pickup' : formData.address,
        phoneNumber: formData.phoneNumber,
        paymentMethod: formData.paymentMethod,
        deliveryMethod: formData.deliveryMethod,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Order creation failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData?.details || 'Failed to place order');
      }

      clearCart();
      router.push('/order-success');
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">{t('checkout')}</h1>
              <p className="text-gray-500 mb-6">{t('emptyCart')}</p>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                onClick={() => router.push('/menu')}
              >
                {t('continueShopping')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('checkout')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <div className="order-2 lg:order-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('orderDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{t('deliveryMethod')}</Label>
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={(value: 'delivery' | 'pickup') =>
                      setFormData({ ...formData, deliveryMethod: value })
                    }
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                      formData.deliveryMethod === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="delivery" id="delivery" />
                      <Label htmlFor="delivery" className="flex items-center space-x-2 cursor-pointer">
                        <Truck className="h-5 w-5 text-gray-600" />
                        <span>{t('delivery')}</span>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                      formData.deliveryMethod === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="pickup" id="pickup" />
                      <Label htmlFor="pickup" className="flex items-center space-x-2 cursor-pointer">
                        <Store className="h-5 w-5 text-gray-600" />
                        <span>{t('pickup')}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.deliveryMethod === 'delivery' && (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{t('address')}</span>
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={errors.address ? 'border-red-500' : ''}
                      placeholder={t('enterAddress')}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm">{errors.address}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>{t('phoneNumber')}</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className={errors.phoneNumber ? 'border-red-500' : ''}
                    placeholder={t('enterPhoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-semibold">{t('paymentMethod')}</Label>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(value: 'card' | 'cash') =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                      formData.paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                        <CreditCard className="h-5 w-5 text-gray-600" />
                        <span>{t('card')}</span>
                      </Label>
                    </div>
                    <div className={`flex items-center space-x-2 p-4 rounded-lg border-2 transition-all ${
                      formData.paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                    }`}>
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                        <span className="text-xl">💵</span>
                        <span>{t('cash')}</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-lg py-6"
                  disabled={submitting}
                >
                  {submitting ? t('processing') : t('placeOrder')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="order-1 lg:order-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="relative w-20 h-20 flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {t('quantity')}: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('subtotal')}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('shipping')}</span>
                    <span>{formData.deliveryMethod === 'pickup' ? t('free') : '$5.00'}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t('total')}</span>
                    <span className="text-orange-500">
                      ${(total + (formData.deliveryMethod === 'pickup' ? 0 : 5)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 