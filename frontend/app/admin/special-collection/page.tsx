'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Menu, X, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imagePaths: string[];
  displayOrder: number;
  isActive: boolean;
  stockS: number;
  stockM: number;
  stockL: number;
  stockXL: number;
}

export default function SpecialCollectionAdmin() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formStockS, setFormStockS] = useState('0');
  const [formStockM, setFormStockM] = useState('0');
  const [formStockL, setFormStockL] = useState('0');
  const [formStockXL, setFormStockXL] = useState('0');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Load products from API
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5195/api/SpecialCollection');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };


  const handleLogout = () => {
    router.push('/admin');
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormImages([]);
    setFormStockS('0');
    setFormStockM('0');
    setFormStockL('0');
    setFormStockXL('0');
    setShowAddModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormPrice(product.price.toString());
    setFormImages(product.imagePaths.length > 0 ? product.imagePaths : []);
    setFormStockS(product.stockS.toString());
    setFormStockM(product.stockM.toString());
    setFormStockL(product.stockL.toString());
    setFormStockXL(product.stockXL.toString());
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (file.type.startsWith('image/')) {
        try {
          // Backend'e dosyayı yükle
          const formData = new FormData();
          formData.append('file', file);

          const response = await fetch('http://localhost:5195/api/SpecialCollection/upload', {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            // Tam URL'i oluştur
            const imageUrl = `http://localhost:5195${data.url}`;
            setFormImages((prev) => [...prev, imageUrl]);
          } else {
            alert('Fotoğraf yüklenirken bir hata oluştu');
          }
        } catch (error) {
          console.error('Upload error:', error);
          alert('Fotoğraf yüklenirken bir hata oluştu');
        }
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index: number) => {
    setFormImages(formImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formPrice || formImages.length === 0) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    const productData = {
      name: formName,
      price: parseFloat(formPrice),
      imagePaths: formImages,
      displayOrder: products.length + 1,
      isActive: true,
      stockS: parseInt(formStockS) || 0,
      stockM: parseInt(formStockM) || 0,
      stockL: parseInt(formStockL) || 0,
      stockXL: parseInt(formStockXL) || 0,
    };

    try {
      if (editingProduct) {
        // Update existing product
        const response = await fetch(`http://localhost:5195/api/SpecialCollection/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...productData, id: editingProduct.id }),
        });

        if (response.ok) {
          await fetchProducts();
          closeModal();
        } else {
          alert('Ürün güncellenirken bir hata oluştu');
        }
      } else {
        // Add new product
        const response = await fetch('http://localhost:5195/api/SpecialCollection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (response.ok) {
          await fetchProducts();
          closeModal();
        } else {
          alert('Ürün eklenirken bir hata oluştu');
        }
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Bir hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      try {
        const response = await fetch(`http://localhost:5195/api/SpecialCollection/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchProducts();
        } else {
          alert('Ürün silinirken bir hata oluştu');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Bir hata oluştu');
      }
    }
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
                href="/admin/dashboard"
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span>Ana Sayfa</span>
              </a>
              <a
                href="/admin/special-collection"
                className="flex items-center space-x-3 px-4 py-3 bg-gray-100 text-black font-medium rounded-lg"
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
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-black">Özel Koleksiyon Ürünleri</h2>
                <p className="text-gray-600 mt-1">Made in Root koleksiyonunu yönetin</p>
              </div>
              <button
                onClick={openAddModal}
                className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Yeni Ürün Ekle</span>
              </button>
            </div>

            {/* Products List */}
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-200 text-center">
                <div className="text-gray-400 mb-4">
                  <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Henüz Ürün Yok
                </h3>
                <p className="text-gray-500 mb-6">
                  İlk ürününüzü ekleyerek başlayın
                </p>
                <button
                  onClick={openAddModal}
                  className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ürün Ekle</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="aspect-square relative bg-gray-100">
                      {product.imagePaths[0] && (
                        <img
                          src={product.imagePaths[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-sm font-medium">
                        {product.imagePaths.length} fotoğraf
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-black mb-1">{product.name}</h3>
                      <p className="text-xl font-bold text-black mb-4">
                        ₺{product.price.toLocaleString('tr-TR')}
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Düzenle</span>
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Sil</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-black">
                {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ürün Adı
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Made in Root Sweatshirt"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="1299"
                  step="0.01"
                  required
                />
              </div>

              {/* Beden Stokları */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Beden Stokları
                </label>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">S</label>
                    <input
                      type="number"
                      value={formStockS}
                      onChange={(e) => setFormStockS(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">M</label>
                    <input
                      type="number"
                      value={formStockM}
                      onChange={(e) => setFormStockM(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">L</label>
                    <input
                      type="number"
                      value={formStockL}
                      onChange={(e) => setFormStockL(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">XL</label>
                    <input
                      type="number"
                      value={formStockXL}
                      onChange={(e) => setFormStockXL(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Fotoğraflar - Drag & Drop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotoğraflar
                </label>

                {/* Upload Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-black bg-gray-50' : 'border-gray-300'
                  }`}
                >
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Fotoğrafları buraya sürükleyin veya tıklayın
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP (Maks. 10MB)
                    </p>
                  </label>
                </div>

                {/* Image Preview Grid */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {formImages.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {editingProduct ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
