import { create } from 'zustand';
import type { Cart } from '@/types/api';

interface CartState {
  cart: Cart | null;
  itemCount: number;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  updateItemCount: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  itemCount: 0,

  setCart: (cart) => {
    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    set({ cart, itemCount });
  },

  clearCart: () => {
    set({ cart: null, itemCount: 0 });
  },

  updateItemCount: () => {
    const { cart } = get();
    if (cart) {
      const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
      set({ itemCount });
    }
  },
}));
