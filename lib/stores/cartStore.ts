import { create } from 'zustand';
import { Cart } from '@/types/api';

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
    const itemCount = cart.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    set({ cart, itemCount });
  },

  clearCart: () => {
    set({ cart: null, itemCount: 0 });
  },

  updateItemCount: () => {
    const { cart } = get();
    if (cart) {
      const itemCount = cart.cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      );
      set({ itemCount });
    }
  },
}));
