'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderSuccessPage() {
  const t = useTranslations('OrderSuccess');
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('orderSuccess')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {t('orderConfirmation')}
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/dashboard')}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                {t('viewOrders')}
              </Button>
              <Button
                onClick={() => router.push('/menu')}
                variant="outline"
                className="w-full"
              >
                {t('continueShopping')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 