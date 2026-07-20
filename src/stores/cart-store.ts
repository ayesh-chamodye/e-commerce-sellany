import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Listing } from '@/types/database';

interface CartState {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addItem: (listing: Listing) => void;
  removeItem: (listingId: string) => void;
  updateQuantity: (listingId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (listingId: string) => boolean;
  getTotal: () => number;
  getCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items: CartItem[]) => set({ items }),

      addItem: (listing: Listing) => {
        set((state) => {
          const exists = state.items.find((item) => item.listingId === listing.id);
          if (exists) {
            return {
              items: state.items.map((item) =>
                item.listingId === listing.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          const newItem: CartItem = {
            id: `${listing.id}-${Date.now()}`,
            userId: '',
            listingId: listing.id,
            listing,
            quantity: 1,
            createdAt: new Date(),
          };
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (listingId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.listingId !== listingId),
        }));
      },

      updateQuantity: (listingId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(listingId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.listingId === listingId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      isInCart: (listingId: string) => {
        return get().items.some((item) => item.listingId === listingId);
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.listing.price * item.quantity,
          0
        );
      },

      getCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'sellany-cart',
    }
  )
);
