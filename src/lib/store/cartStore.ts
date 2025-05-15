import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartStore {
  items: CartItem[];
  total: number;
  isLoading: boolean;
  error: string | null;
  userId: string | null;
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  setItems: (items: CartItem[]) => void;
  setUserId: (userId: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      isLoading: false,
      error: null,
      userId: null,

      setUserId: (userId) => {
        set({ userId });
        if (!userId) {
          // Clear cart when user logs out
          set({ items: [], total: 0 });
        }
      },

      setItems: (items) => {
        set({
          items,
          total: calculateTotal(items),
        });
      },

      fetchCart: async () => {
        try {
          const userId = get().userId;
          if (!userId) return;

          set({ isLoading: true, error: null });
          const response = await fetch('/api/cart');
          if (!response.ok) throw new Error('Failed to fetch cart');
          const data = await response.json();
          
          if (data.items) {
            set({
              items: data.items,
              total: calculateTotal(data.items),
            });
          }
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ error: 'Failed to fetch cart' });
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        try {
          const userId = get().userId;
          if (!userId) return;

          set({ isLoading: true, error: null });
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: get().items }),
          });
          if (!response.ok) throw new Error('Failed to sync cart');
          
          const data = await response.json();
          if (data.items) {
            set({
              items: data.items,
              total: calculateTotal(data.items),
            });
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
          set({ error: 'Failed to sync cart' });
        } finally {
          set({ isLoading: false });
        }
      },

      addItem: async (item) => {
        try {
          set({ isLoading: true, error: null });
          const currentItems = get().items;
          const existingItem = currentItems.find((i) => i.id === item.id);

          let newItems;
          if (existingItem) {
            newItems = currentItems.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            );
          } else {
            newItems = [...currentItems, { ...item, quantity: 1 }];
          }

          set({
            items: newItems,
            total: calculateTotal(newItems),
          });

          const userId = get().userId;
          if (userId) {
            await get().syncCart();
          }
        } catch (error) {
          console.error('Error adding item:', error);
          set({ error: 'Failed to add item' });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const newItems = get().items.filter((item) => item.id !== id);
          set({
            items: newItems,
            total: calculateTotal(newItems),
          });

          const userId = get().userId;
          if (userId) {
            await get().syncCart();
          }
        } catch (error) {
          console.error('Error removing item:', error);
          set({ error: 'Failed to remove item' });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (id, quantity) => {
        try {
          set({ isLoading: true, error: null });
          if (quantity < 1) {
            await get().removeItem(id);
            return;
          }

          const newItems = get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          set({
            items: newItems,
            total: calculateTotal(newItems),
          });

          const userId = get().userId;
          if (userId) {
            await get().syncCart();
          }
        } catch (error) {
          console.error('Error updating quantity:', error);
          set({ error: 'Failed to update quantity' });
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const userId = get().userId;
          if (userId) {
            await fetch('/api/cart', { method: 'DELETE' });
          }
          set({ items: [], total: 0 });
        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ error: 'Failed to clear cart' });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'cart-storage',
      skipHydration: typeof window === 'undefined',
    }
  )
);

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}; 