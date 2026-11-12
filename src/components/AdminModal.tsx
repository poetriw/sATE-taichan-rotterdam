import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Flame,
  CheckCircle2,
  Settings,
  DollarSign,
  Phone,
  Tag,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Category, Product } from '../types';
import { formatRupiah } from '../utils/orderLogic';

const CATEGORIES: Exclude<Category, 'Semua'>[] = [
  'Sate Taichan',
  'Paket Hemat',
  'Menu Tambahan',
  'Minuman',
  'Menu Lainnya',
];

export const AdminModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    businessSettings,
    updateBusinessSettings,
  } = useCart();

  const [activeTab, setActiveTab] = useState<'menu' | 'settings'>('menu');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  // Form State for Product Add/Edit
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Exclude<Category, 'Semua'>>('Sate Taichan');
  const [price, setPrice] = useState<number>(25000);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [portionDetail, setPortionDetail] = useState('');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [spicyLevelAvailable, setSpicyLevelAvailable] = useState(true);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState(businessSettings);

  if (!isAdminOpen) return null;

  const showNotice = (msg: string) => {
    setStatusNotice(msg);
    setTimeout(() => setStatusNotice(null), 3000);
  };

  const startCreate = () => {
    setEditingProduct(null);
    setIsCreatingNew(true);
    setName('');
    setCategory('Sate Taichan');
    setPrice(25000);
    setDescription('');
    setImage('/src/assets/images/hero_sate_taichan_1794494904829.jpg');
    setPortionDetail('');
    setIsBestSeller(false);
    setIsAvailable(true);
    setSpicyLevelAvailable(true);
  };

  const startEdit = (p: Product) => {
    setIsCreatingNew(false);
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setDescription(p.description);
    setImage(p.image);
    setPortionDetail(p.portionDetail || '');
    setIsBestSeller(p.isBestSeller);
    setIsAvailable(p.isAvailable);
    setSpicyLevelAvailable(Boolean(p.spicyLevelAvailable));
  };

  const cancelProductForm = () => {
    setIsCreatingNew(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || isNaN(price)) return;

    if (isCreatingNew) {
      addProduct({
        name: name.trim(),
        category,
        price: Number(price),
        description: description.trim(),
        image: image.trim() || '/src/assets/images/hero_sate_taichan_1794494904829.jpg',
        portionDetail: portionDetail.trim(),
        isBestSeller,
        isAvailable,
        spicyLevelAvailable,
      });
      showNotice('Menu baru berhasil ditambahkan dan disimpan!');
    } else if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: name.trim(),
        category,
        price: Number(price),
        description: description.trim(),
        image: image.trim() || editingProduct.image,
        portionDetail: portionDetail.trim(),
        isBestSeller,
        isAvailable,
        spicyLevelAvailable,
      });
      showNotice('Data menu berhasil diperbarui!');
    }

    cancelProductForm();
  };

  const handleDelete = (id: string, prodName: string) => {
    if (window.confirm(`Yakin ingin menghapus menu "${prodName}"?`)) {
      deleteProduct(id);
      showNotice(`Menu "${prodName}" berhasil dihapus.`);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings(settingsForm);
    showNotice('Pengaturan bisnis berhasil disimpan!');
  };

  const handleResetToDefault = () => {
    if (
      window.confirm(
        'Apakah Anda yakin ingin me-reset seluruh menu kembali ke data default awal?'
      )
    ) {
      resetProductsToDefault();
      cancelProductForm();
      showNotice('Seluruh menu telah di-reset ke pengaturan awal.');
    }
  };

  // Quick stats
  const bestSellerCount = products.filter((p) => p.isBestSeller).length;
  const outOfStockCount = products.filter((p) => !p.isAvailable).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-2xl text-[#1A1A1A] flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8E2D8] flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#F39223]/15 border border-[#F39223]/30 text-[#F39223]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#1A1A1A]">
                Admin Portal Sate Taichan Rotterdam
              </h2>
              <p className="text-xs text-[#6B655B]">
                Kelola menu, update harga resmi, stok ketersediaan, & pengaturan WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAdminOpen(false)}
            aria-label="Tutup admin modal"
            className="p-2 text-[#7A7368] hover:text-[#1A1A1A] bg-[#F5F2EB] rounded-xl cursor-pointer border border-[#E8E2D8] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Status banner */}
        <div className="px-6 pt-4 bg-[#FAF7F2] border-b border-[#E8E2D8] flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab('menu');
                cancelProductForm();
              }}
              className={`py-2 px-4 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-white border-[#E8E2D8] text-[#F39223]'
                  : 'bg-transparent border-transparent text-[#7A7368] hover:text-[#1A1A1A]'
              }`}
            >
              Kelola Menu ({products.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('settings');
                cancelProductForm();
              }}
              className={`py-2 px-4 text-xs font-bold rounded-t-xl border-t border-x transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-white border-[#E8E2D8] text-[#F39223]'
                  : 'bg-transparent border-transparent text-[#7A7368] hover:text-[#1A1A1A]'
              }`}
            >
              Pengaturan Toko & WhatsApp
            </button>
          </div>

          {statusNotice && (
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 pb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{statusNotice}</span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: KELOLA MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#FAF7F2] border border-[#E8E2D8] p-3 rounded-xl">
                  <span className="text-[11px] text-[#7A7368] block">Total Menu</span>
                  <span className="text-lg font-black text-[#1A1A1A]">{products.length}</span>
                </div>
                <div className="bg-[#FAF7F2] border border-[#E8E2D8] p-3 rounded-xl">
                  <span className="text-[11px] text-[#7A7368] block">Best Seller</span>
                  <span className="text-lg font-black text-[#F39223]">{bestSellerCount}</span>
                </div>
                <div className="bg-[#FAF7F2] border border-[#E8E2D8] p-3 rounded-xl">
                  <span className="text-[11px] text-[#7A7368] block">Stok Habis</span>
                  <span className="text-lg font-black text-[#ED1C24]">{outOfStockCount}</span>
                </div>
                <div className="bg-[#FAF7F2] border border-[#E8E2D8] p-3 rounded-xl">
                  <span className="text-[11px] text-[#7A7368] block">Status Database</span>
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan Otomatis
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold text-sm text-[#1A1A1A]">
                  Daftar Katalog Produk
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetToDefault}
                    className="px-3 py-1.5 text-xs font-semibold text-[#555048] hover:text-[#1A1A1A] bg-[#FAF7F2] rounded-xl border border-[#E8E2D8] flex items-center gap-1.5 cursor-pointer hover:bg-[#F5F2EB] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Default</span>
                  </button>

                  <button
                    type="button"
                    onClick={startCreate}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#F39223] to-[#ED1C24] hover:brightness-105 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Menu Baru</span>
                  </button>
                </div>
              </div>

              {/* Add / Edit Form Drawer/Box */}
              {(isCreatingNew || editingProduct) && (
                <div className="bg-[#FAF7F2] border-2 border-[#F39223]/40 rounded-2xl p-5 space-y-4 animate-fade-in shadow-md">
                  <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
                    <h4 className="font-extrabold text-sm text-[#F39223] flex items-center gap-2">
                      <Flame className="w-4 h-4 text-[#ED1C24]" />
                      <span>{isCreatingNew ? 'Form Tambah Menu Baru' : `Edit Menu: ${editingProduct?.name}`}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={cancelProductForm}
                      className="text-xs text-[#7A7368] hover:text-[#1A1A1A]"
                    >
                      Batal
                    </button>
                  </div>

                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-[#555048] font-semibold block mb-1">
                        Nama Menu *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Sate Taichan Paha Spesial"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                      />
                    </div>

                    <div>
                      <label className="text-[#555048] font-semibold block mb-1">
                        Kategori *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[#555048] font-semibold block mb-1">
                        Harga (Rupiah) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="500"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        placeholder="Contoh: 25000"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                      />
                      <span className="text-[10px] text-[#F39223] mt-1 block font-bold">
                        Preview: {formatRupiah(price)}
                      </span>
                    </div>

                    <div>
                      <label className="text-[#555048] font-semibold block mb-1">
                        Detail Porsi / Isi (Opsional)
                      </label>
                      <input
                        type="text"
                        value={portionDetail}
                        onChange={(e) => setPortionDetail(e.target.value)}
                        placeholder="Contoh: 10 Tusuk + Sambal + Jeruk Nipis"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[#555048] font-semibold block mb-1">
                        URL Foto Produk (Bisa path lokal atau link gambar)
                      </label>
                      <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="/src/assets/images/... atau https://..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-[#555048] font-semibold block mb-1">
                        Deskripsi Menu
                      </label>
                      <textarea
                        rows={2}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Tuliskan rasa, potongan daging, atau keunggulan menu ini..."
                        className="w-full px-3 py-2 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                      />
                    </div>

                    {/* Checkbox toggles */}
                    <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A]">
                        <input
                          type="checkbox"
                          checked={isBestSeller}
                          onChange={(e) => setIsBestSeller(e.target.checked)}
                          className="rounded text-[#ED1C24] focus:ring-0"
                        />
                        <span>Tandai sebagai Best Seller</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A]">
                        <input
                          type="checkbox"
                          checked={isAvailable}
                          onChange={(e) => setIsAvailable(e.target.checked)}
                          className="rounded text-emerald-600 focus:ring-0"
                        />
                        <span>Stok Tersedia (Aktif untuk Dipesan)</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A]">
                        <input
                          type="checkbox"
                          checked={spicyLevelAvailable}
                          onChange={(e) => setSpicyLevelAvailable(e.target.checked)}
                          className="rounded text-[#F39223] focus:ring-0"
                        />
                        <span>Pilihan Level Pedas Aktif</span>
                      </label>
                    </div>

                    <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
                      <button
                        type="button"
                        onClick={cancelProductForm}
                        className="px-4 py-2 bg-[#F5F2EB] hover:bg-[#EAE4D8] rounded-xl text-[#555048] font-semibold"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-[#F39223] to-[#ED1C24] hover:brightness-105 text-white font-bold rounded-xl shadow-sm cursor-pointer"
                      >
                        {isCreatingNew ? 'Simpan Menu Baru' : 'Simpan Perubahan'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table of products */}
              <div className="bg-white border border-[#E8E2D8] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] text-[#555048] border-b border-[#E8E2D8] uppercase font-semibold">
                      <tr>
                        <th className="p-3.5">Menu</th>
                        <th className="p-3.5">Kategori</th>
                        <th className="p-3.5">Harga</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8E2D8]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                          <td className="p-3.5 font-semibold text-[#1A1A1A]">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-cover bg-[#F5F2EB] shrink-0 border border-[#E8E2D8]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/src/assets/images/hero_sate_taichan_1794494904829.jpg';
                                }}
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[#1A1A1A]">{p.name}</span>
                                  {p.isBestSeller && (
                                    <span className="bg-[#ED1C24] text-white text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                                      Best
                                    </span>
                                  )}
                                </div>
                                {p.portionDetail && (
                                  <span className="text-[10px] text-[#7A7368]">
                                    {p.portionDetail}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-[#555048] whitespace-nowrap">
                            {p.category}
                          </td>
                          <td className="p-3.5 font-bold text-[#F39223] whitespace-nowrap tabular-nums">
                            {formatRupiah(p.price)}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                updateProduct({ ...p, isAvailable: !p.isAvailable });
                                showNotice(`Status "${p.name}" diubah ke ${!p.isAvailable ? 'Tersedia' : 'Habis'}.`);
                              }}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border cursor-pointer ${
                                p.isAvailable
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                  : 'bg-red-50 border-red-300 text-[#ED1C24]'
                              }`}
                            >
                              {p.isAvailable ? 'Tersedia' : 'Habis'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => startEdit(p)}
                              title="Edit menu"
                              className="p-1.5 text-[#555048] hover:text-[#F39223] bg-[#F5F2EB] rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(p.id, p.name)}
                              title="Hapus menu"
                              className="p-1.5 text-[#555048] hover:text-[#ED1C24] bg-[#F5F2EB] rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PENGATURAN TOKO & WHATSAPP */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs max-w-2xl mx-auto">
              
              <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-sm text-[#1A1A1A] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Nomor WhatsApp Tujuan Pesanan</span>
                </h4>
                <p className="text-[#6B655B] leading-relaxed">
                  Masukkan nomor WhatsApp kasir atau admin resmi (gunakan format internasional diawali 62, contoh: 6281234567890).
                </p>
                <div>
                  <label className="text-[#555048] font-semibold block mb-1">
                    Nomor WhatsApp Bisnis
                  </label>
                  <input
                    type="text"
                    required
                    value={settingsForm.whatsappNumber}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    placeholder="Contoh: 6281234567890"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] font-mono focus:outline-none focus:border-[#F39223]"
                  />
                </div>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-sm text-[#1A1A1A] flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#F39223]" />
                  <span>Banner Promosi & Pengumuman</span>
                </h4>

                <label className="flex items-center gap-2 cursor-pointer text-[#1A1A1A]">
                  <input
                    type="checkbox"
                    checked={settingsForm.promoActive}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoActive: e.target.checked })}
                    className="rounded text-[#F39223] focus:ring-0"
                  />
                  <span className="font-semibold">Aktifkan Banner Promosi di Website</span>
                </label>

                <div>
                  <label className="text-[#555048] font-semibold block mb-1">
                    Label Diskon / Kicker
                  </label>
                  <input
                    type="text"
                    value={settingsForm.promoDiscountText}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoDiscountText: e.target.value })}
                    placeholder="Contoh: Diskon Nobar 10%"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                  />
                </div>

                <div>
                  <label className="text-[#555048] font-semibold block mb-1">
                    Judul Promosi
                  </label>
                  <input
                    type="text"
                    value={settingsForm.promoTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoTitle: e.target.value })}
                    placeholder="Contoh: Promo Teman Nongkrong Rotterdam"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                  />
                </div>

                <div>
                  <label className="text-[#555048] font-semibold block mb-1">
                    Deskripsi Promosi
                  </label>
                  <textarea
                    rows={2}
                    value={settingsForm.promoDescription}
                    onChange={(e) => setSettingsForm({ ...settingsForm, promoDescription: e.target.value })}
                    placeholder="Penjelasan promo..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                  />
                </div>
              </div>

              <div className="bg-[#FAF7F2] border border-[#E8E2D8] rounded-2xl p-5 space-y-4">
                <h4 className="font-extrabold text-sm text-[#1A1A1A]">
                  Informasi Alamat Kedai
                </h4>
                <div>
                  <label className="text-[#555048] font-semibold block mb-1">
                    Alamat Lengkap
                  </label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E2D8] text-[#1A1A1A] focus:outline-none focus:border-[#F39223]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#F39223] to-[#ED1C24] hover:brightness-105 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Seluruh Pengaturan</span>
                </button>
              </div>

            </form>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E8E2D8] bg-[#FAF7F2] flex items-center justify-between text-xs text-[#7A7368]">
          <span>Sate Taichan Rotterdam • Panel Pengelolaan Website</span>
          <button
            type="button"
            onClick={() => setIsAdminOpen(false)}
            className="px-4 py-1.5 bg-white hover:bg-[#F5F2EB] text-[#1A1A1A] font-semibold rounded-lg border border-[#E8E2D8] transition-colors"
          >
            Tutup Panel
          </button>
        </div>

      </div>
    </div>
  );
};
