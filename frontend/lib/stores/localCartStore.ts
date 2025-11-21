import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  slug: string;
  selectedSize: string;
  quantity: number;
}

interface LocalCartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, size: string) => void;
  updateQuantity: (id: string, size: string, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

export const useLocalCartStore = create<LocalCartState>()(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      itemCount: 0,

      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find(
          (i) => i.id === item.id && i.selectedSize === item.selectedSize
        );

        if (existingItem) {
          // Ürün zaten sepette, miktarı artır
          set({
            items: items.map((i) =>
              i.id === item.id && i.selectedSize === item.selectedSize
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          // Yeni ürün ekle
          set({ items: [...items, item] });
        }

        // Toplam fiyat ve adet hesapla
        const newItems = get().items;
        const totalPrice = newItems.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const itemCount = newItems.reduce((sum, i) => sum + i.quantity, 0);
        set({ totalPrice, itemCount });
      },

      removeItem: (id, size) => {
        const items = get().items.filter(
          (i) => !(i.id === id && i.selectedSize === size)
        );
        set({ items });

        // Toplam fiyat ve adet hesapla
        const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
        set({ totalPrice, itemCount });
      },

      updateQuantity: (id, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, size);
          return;
        }

        const items = get().items.map((i) =>
          i.id === id && i.selectedSize === size ? { ...i, quantity } : i
        );
        set({ items });

        // Toplam fiyat ve adet hesapla
        const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
        set({ totalPrice, itemCount });
      },

      clearCart: () => {
        set({ items: [], totalPrice: 0, itemCount: 0 });
      },
    }),
    {
      name: 'local-cart-storage',
    }
  )
);
