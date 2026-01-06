import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getProductImage } from '@/lib/utils/format';

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  slug: string;
}

interface FavoritesState {
  favorites: FavoriteProduct[];
  addFavorite: (product: FavoriteProduct) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
  fixImageUrls: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (product) =>
        set((state) => ({
          favorites: [...state.favorites, product],
        })),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        })),
      isFavorite: (productId) =>
        get().favorites.some((p) => p.id === productId),
      clearFavorites: () => set({ favorites: [] }),
      fixImageUrls: () => {
        const favorites = get().favorites;
        const fixedFavorites = favorites.map((fav) => ({
          ...fav,
          imageUrl: getProductImage(fav.imageUrl, fav.name),
        }));
        set({ favorites: fixedFavorites });
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
);
