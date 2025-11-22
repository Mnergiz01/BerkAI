'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLocalCartStore } from '@/lib/stores/localCartStore';
import { useFavoritesStore } from '@/lib/stores/favoritesStore';
import { Logo } from '@/components/ui/Logo';
import { LoginDrawer } from '@/components/auth/LoginDrawer';

export function Header() {
  const router = useRouter();
  const { user, isAuthenticated, clearAuth, checkTokenExpiry } = useAuthStore();
  const { itemCount } = useLocalCartStore();
  const { favorites } = useFavoritesStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState('');
  const [showNavbar, setShowNavbar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLoginDrawer, setShowLoginDrawer] = useState(false);

  // Get current pathname
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  // Check if we're on special collection, cart, or favorites pages
  const isSpecialCollectionPage = pathname.includes('/special-collection');
  const isCartOrFavoritesPage = pathname.includes('/cart') || pathname.includes('/favorites');

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
      router.push(`/shop/products?search=${encodeURIComponent(searchTerm)}`);
      setShowSearch(false);
      setSearchTerm('');
    }
  };

  const handleLogout = () => {
    clearAuth();
    setShowUserMenu(false);
    router.push('/');
  };

  const displayName = user?.firstName || user?.username || 'User';

  if (!mounted) {
    return null; // or return a loading skeleton
  }

  // Special collection pages: scroll-up navbar behavior
  // Cart and favorites pages: always white with dark logo at top, then scroll behavior
  // Other pages: sticky with scroll-based background
  const shouldBeWhite = isSpecialCollectionPage
    ? showNavbar
    : isCartOrFavoritesPage
      ? true  // Always white for cart/favorites
      : scrolled;

  const isDarkLogo = isSpecialCollectionPage
    ? showNavbar
    : isCartOrFavoritesPage
      ? true  // Always dark for cart/favorites
      : scrolled;

  const headerPosition = (isSpecialCollectionPage || isCartOrFavoritesPage) ? (showNavbar ? 'fixed' : 'absolute') : 'sticky';

  return (
    <header className={`${headerPosition} top-0 z-50 w-full transition-all duration-300 ${
      shouldBeWhite ? 'bg-white shadow-sm border-b border-gray-200' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Logo variant={isDarkLogo ? 'dark' : 'light'} />
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
                    className={`w-48 px-3 py-1 text-sm border-b outline-none transition-colors ${
                      isDarkLogo
                        ? 'text-black border-gray-300 focus:border-black placeholder:text-gray-500'
                        : 'text-white border-white/30 focus:border-white placeholder:text-white/60'
                    }`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowSearch(false)}
                    className={`transition-colors ${
                      isDarkLogo ? 'text-gray-500 hover:text-black' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className={`transition-colors ${
                    isDarkLogo ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Profile Icon - Only show if not authenticated */}
            {!isAuthenticated && (
              <button
                onClick={() => setShowLoginDrawer(true)}
                className={`transition-colors ${
                  isDarkLogo ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'
                }`}
                aria-label="Login"
              >
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Favorites Icon */}
            <Link
              href="/favorites"
              className={`relative transition-colors ${
                isDarkLogo ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'
              }`}
              aria-label="Favorites"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className={`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs transition-colors ${
                  isDarkLogo ? 'bg-black text-white' : 'bg-white text-black'
                }`}>
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className={`relative transition-colors ${
                isDarkLogo ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'
              }`}
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className={`absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs transition-colors ${
                  isDarkLogo ? 'bg-black text-white' : 'bg-white text-black'
                }`}>
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Username with Dropdown - Only show if authenticated - At the end */}
            {isAuthenticated && (
              <div className="relative mr-4 user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`text-sm font-medium transition-colors ${
                    isDarkLogo ? 'text-gray-700 hover:text-black' : 'text-white hover:text-white/80'
                  }`}
                >
                  {displayName}
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        router.push('/orders');
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Siparişlerim
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>
        </div>
      </div>

      {/* Login Drawer */}
      <LoginDrawer isOpen={showLoginDrawer} onClose={() => setShowLoginDrawer(false)} />
    </header>
  );
}
export default Header;
