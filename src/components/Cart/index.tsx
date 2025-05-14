"use client";

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cartStore';
import { useSession } from 'next-auth/react';

export default function Cart() {
  const t = useTranslations('Cart');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  
  const { items, total, updateQuantity, removeItem, fetchCart, isLoading } = useCartStore();

  useEffect(() => {
    if (session?.user?.id) {
      fetchCart();
    }
  }, [session]);

  const handleCheckout = () => {
    router.push('/checkout');
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-6 w-6" />
        {items.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {items.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-screen max-w-sm bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">{t('yourCart')}</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              </div>
            ) : items.length === 0 ? (
              <p className="text-gray-400 text-center py-8">{t('emptyCart')}</p>
            ) : (
              <>
                <div className="space-y-4 max-h-96 overflow-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 bg-gray-700/50 p-3 rounded-lg">
                      {item.image && (
                        <div className="relative w-16 h-16 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-100 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                        >
                          <Minus className="h-4 w-4 text-gray-200" />
                        </Button>
                        <span className="text-gray-200 w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-700 hover:bg-gray-600 border-gray-600"
                        >
                          <Plus className="h-4 w-4 text-gray-200" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="hover:bg-gray-700/50"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold text-gray-100">{t('total')}:</span>
                    <span className="font-semibold text-gray-100">${total.toFixed(2)}</span>
                  </div>
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={handleCheckout}
                  >
                    {t('checkout')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 