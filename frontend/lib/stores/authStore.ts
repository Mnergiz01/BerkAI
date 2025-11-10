import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  setAuth: (user: User, token: string, rememberMe?: boolean) => void;
  clearAuth: () => void;
  updateUser: (user: User) => void;
  checkTokenExpiry: () => void;
}

// Helper function to decode JWT and check expiry
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch {
    return true;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      rememberMe: false,

      setAuth: (user, token, rememberMe = false) => {
        set({
          user,
          token,
          isAuthenticated: true,
          rememberMe,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          rememberMe: false,
        });
      },

      updateUser: (user) => {
        set({ user });
      },

      checkTokenExpiry: () => {
        const state = get();

        // If not remember me and token exists, check expiry
        if (!state.rememberMe && state.token) {
          if (isTokenExpired(state.token)) {
            // Token expired, clear auth
            get().clearAuth();
          }
        }

        // If remember me is enabled, keep session even if token expired
        // The API will handle the 401 response
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
      onRehydrateStorage: () => (state) => {
        // Check token expiry after rehydration
        if (state) {
          state.checkTokenExpiry();
        }
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
      }),
    }
  )
);
