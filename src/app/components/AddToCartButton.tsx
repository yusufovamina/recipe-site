import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCartStore, CartItem } from '@/lib/store/cartStore';

interface AddToCartButtonProps {
  recipeId: string;
  name: string;
  price: number;
  image?: string;
}

export default function AddToCartButton({
  recipeId,
  name,
  price,
  image,
}: AddToCartButtonProps) {
  const t = useTranslations('Cart');
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const item: CartItem = {
      id: recipeId,
      name,
      price,
      image,
      quantity: 1,
    };
    
    addItem(item);

    toast({
      title: t('addedToCart'),
      description: name,
      duration: 2000,
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      className="w-full"
      variant="default"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {t('addToCart')}
    </Button>
  );
} 