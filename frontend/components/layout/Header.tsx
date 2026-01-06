'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLocalCartStore } from '@/lib/stores/localCartStore';
import { useFavoritesStore } from '@/lib/stores/favoritesStore';
import { Logo } from '@/components/ui/Logo';
import { ProductFilters } from '@/components/products/ProductFilters';
import type { ProductFilters as Filters } from '@/types/api';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth, checkTokenExpiry } = useAuthStore();
  const { itemCount } = useLocalCartStore();
  const { favorites } = useFavoritesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showFiltersSidebar, setShowFiltersSidebar] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    pageNumber: 1,
    pageSize: 12,
  });

  // Check if we're on special collection, cart, or favorites pages
  const isSpecialCollectionPage = pathname.includes('/special-collection');
  const isCartOrFavoritesPage = pathname.includes('/cart') || pathname.includes('/favorites');
  const isProductsPage = pathname.includes('/products');

  // Hydration fix for zustand persist
  useEffect(() => {
    setMounted(true);
    // Check token expiry on mount
    checkTokenExpiry();
  }, [checkTokenExpiry]);

  // Scroll tracking - for special collection, cart, and favorites pages
  // For other pages, track normal scroll
  useEffect(() => {
    if (isSpecialCollectionPage || isCartOrFavoritesPage) {
      // Special collection, cart, favorites: scroll-up detection
      let previousScrollY = window.scrollY;

      const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY < previousScrollY && currentScrollY > 100) {
          // Scrolling up & past threshold - show navbar
          setShowNavbar(true);
        } else if (currentScrollY > previousScrollY || currentScrollY < 100) {
          // Scrolling down or near top - hide navbar
          setShowNavbar(false);
        }

        previousScrollY = currentScrollY;
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // Other pages: normal scroll behavior
      const handleScroll = () => {
        setScrolled(window.scrollY > 50);
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isSpecialCollectionPage, isCartOrFavoritesPage])

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container')) {
          setShowUserMenu(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    clearAuth();
    setShowUserMenu(false);
    router.push('/');
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // Navigate to products page with filters
    const params = new URLSearchParams();
    if (newFilters.categoryId) params.set('categoryId', newFilters.categoryId);
    if (newFilters.brandIds && newFilters.brandIds.length > 0) {
      // Add multiple brand IDs as comma-separated values
      params.set('brandIds', newFilters.brandIds.join(','));
    }
    if (newFilters.gender) params.set('gender', newFilters.gender);
    if (newFilters.minPrice) params.set('minPrice', newFilters.minPrice.toString());
    if (newFilters.maxPrice) params.set('maxPrice', newFilters.maxPrice.toString());
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm);

    router.push(`/products?${params.toString()}`);
  };

  const displayName = user?.firstName || user?.username || 'User';

  if (!mounted) {
    return null; // or return a loading skeleton
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md border-gray-200' : 'bg-black border-gray-800'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Menu Button - Only on Products Page */}
          {isProductsPage && (
            <button
              onClick={() => setShowFiltersSidebar(true)}
              className={`transition-colors ${
                scrolled ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'
              }`}
              aria-label="Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Logo variant={scrolled ? 'dark' : 'light'} />
          </div>

          {/* Right Navigation - Icons */}
          <nav className="flex items-center gap-6 ml-auto">
            {/* Search Icon with Input */}
            <div className="relative">
              {showSearch ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Ara..."
                    className={`w-48 px-3 py-1 text-sm border-b outline-none transition-colors bg-transparent ${
                      scrolled
                        ? 'text-black border-black/30 focus:border-black placeholder:text-black/60'
                        : 'text-white border-white/30 focus:border-white placeholder:text-white/60'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className={`transition-colors ${
                      scrolled ? 'text-black/70 hover:text-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className={`transition-colors ${
                    scrolled ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Favorites Icon */}
            <Link
              href="/favorites"
              className={`relative transition-colors ${
                scrolled ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'
              }`}
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className={`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs transition-colors ${
                  scrolled ? 'bg-black text-white' : 'bg-white text-black'
                }`}>
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className={`relative transition-colors ${
                scrolled ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'
              }`}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className={`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs transition-colors ${
                  scrolled ? 'bg-black text-white' : 'bg-white text-black'
                }`}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Icon / Login */}
            {isAuthenticated ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 transition-colors ${
                    scrolled ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'
                  }`}
                  aria-label="User menu"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{displayName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Siparişlerim
                    </Link>
                    <Link
                      href="/favorites"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Favorilerim
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`transition-colors ${
                  scrolled ? 'text-black hover:text-black/80' : 'text-white hover:text-white/80'
                }`}
                aria-label="Login"
              >
                <User className="w-5 h-5" />
              </Link>
            )}

          </nav>
        </div>
      </div>

      {/* Filters Sidebar */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        showFiltersSidebar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 transition-opacity duration-300"
          onClick={() => setShowFiltersSidebar(false)}
        />

        {/* Sidebar Panel */}
        <div className={`absolute inset-y-0 left-0 w-full max-w-2xl bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          showFiltersSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}>
          {/* Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-8 py-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Menu className="w-6 h-6 text-gray-900" />
                <h2 className="text-2xl font-light text-gray-900 tracking-wide">Menü</h2>
              </div>
              <button
                onClick={() => setShowFiltersSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Kapat"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="h-[calc(100vh-89px)]">
            <ProductFilters filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        </div>
      </div>

    </header>
  );
}
export default Header;
