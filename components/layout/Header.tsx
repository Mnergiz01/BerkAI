'use client';

import Link from 'next/link';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { itemCount } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop/products?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-black text-white text-xs py-2">
        <div className="container mx-auto px-4 text-center">
          <p>Ücretsiz kargo 500 TL ve üzeri alışverişlerde</p>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-tight">
            FASHION
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/shop/products?gender=2"
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              KADIN
            </Link>
            <Link
              href="/shop/products?gender=1"
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              ERKEK
            </Link>
            <Link
              href="/shop/products?gender=3"
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              ÇOCUK
            </Link>
            <Link
              href="/shop/products"
              className="text-sm font-medium hover:text-gray-600 transition-colors"
            >
              TÜM ÜRÜNLER
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 focus:outline-none focus:border-black transition-colors"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <div className="relative group">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      href="/account/orders"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Siparişlerim
                    </Link>
                    <Link
                      href="/account/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Hesabım
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Üye Ol
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="lg:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 focus:outline-none focus:border-black transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/shop/products?gender=2"
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              KADIN
            </Link>
            <Link
              href="/shop/products?gender=1"
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              ERKEK
            </Link>
            <Link
              href="/shop/products?gender=3"
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              ÇOCUK
            </Link>
            <Link
              href="/shop/products"
              className="block py-2 text-sm font-medium hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              TÜM ÜRÜNLER
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
