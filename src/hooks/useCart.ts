'use client';

import { useEffect, useCallback } from 'react';
import { useCartStore } from '@/stores/cart-store';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/types/database';

export function useCart() {
  const { user } = useAuth();
  const {
    items,
    addItem: storeAddItem,
    removeItem: storeRemoveItem,
    updateQuantity: storeUpdateQuantity,
    clearCart: storeClearCart,
    setItems,
  } = useCartStore();

  const syncCartFromServer = useCallback(async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const serverItems: CartItem[] = await response.json();
        setItems(serverItems);
      }
    } catch (error) {
      console.error('Failed to sync cart from server:', error);
    }
  }, [user, setItems]);

  const syncItemToServer = useCallback(
    async (item: CartItem) => {
      if (!user) return;

      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            listingId: item.listingId,
            listing: item.listing,
            quantity: item.quantity,
          }),
        });
      } catch (error) {
        console.error('Failed to sync cart item to server:', error);
      }
    },
    [user]
  );

  const removeItemFromServer = useCallback(
    async (listingId: string) => {
      if (!user) return;

      try {
        await fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId }),
        });
      } catch (error) {
        console.error('Failed to remove cart item from server:', error);
      }
    },
    [user]
  );

  useEffect(() => {
    if (user) {
      syncCartFromServer();
    } else {
      storeClearCart();
    }
  }, [user, syncCartFromServer, storeClearCart]);

  const addItem = useCallback(
    async (listing: CartItem['listing']) => {
      storeAddItem(listing);
      const item = useCartStore.getState().items.find((i) => i.listingId === listing.id);
      if (item && user) {
        await syncItemToServer(item);
      }
    },
    [storeAddItem, syncItemToServer, user]
  );

  const removeItem = useCallback(
    async (listingId: string) => {
      storeRemoveItem(listingId);
      if (user) {
        await removeItemFromServer(listingId);
      }
    },
    [storeRemoveItem, removeItemFromServer, user]
  );

  const updateQuantity = useCallback(
    async (listingId: string, quantity: number) => {
      storeUpdateQuantity(listingId, quantity);
      const item = useCartStore.getState().items.find((i) => i.listingId === listingId);
      if (item && user) {
        await syncItemToServer(item);
      }
    },
    [storeUpdateQuantity, syncItemToServer, user]
  );

  const clearCart = useCallback(async () => {
    storeClearCart();
    if (user) {
      try {
        const items = useCartStore.getState().items;
        await Promise.all(items.map((item) => removeItemFromServer(item.listingId)));
      } catch (error) {
        console.error('Failed to clear cart on server:', error);
      }
    }
  }, [storeClearCart, removeItemFromServer, user]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart: (listingId: string) => useCartStore.getState().isInCart(listingId),
    getTotal: useCartStore.getState().getTotal,
    getCount: useCartStore.getState().getCount,
    syncCartFromServer,
  };
}
