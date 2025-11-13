'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-black transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-2xl font-bold text-black">BerkAI Admin Panel</h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside
          className={`bg-white border-r border-gray-200 fixed left-0 top-16 bottom-0 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <nav className="p-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Menü
              </p>
              <a
                href="/admin/special-collection"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>Özel Koleksiyon</span>
              </a>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-8 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {/* Welcome Card */}
            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-black mb-4">
                Yönetim Paneline Hoş Geldiniz
              </h2>
              <p className="text-gray-600">
                Sol menüden işlemlerinizi gerçekleştirebilirsiniz.
              </p>
            </div>

            {/* Empty State - Panel içeriği buraya eklenecek */}
            <div className="mt-8">
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <div className="text-gray-400 mb-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Menu className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Panel Hazır
                </h3>
                <p className="text-gray-500">
                  Panel içeriği eklenmeyi bekliyor...
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
