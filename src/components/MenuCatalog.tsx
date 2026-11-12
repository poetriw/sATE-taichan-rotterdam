import React, { useState, useMemo } from 'react';
import { Search, Flame, Plus, Eye, Check, SlidersHorizontal, X, FileImage } from 'lucide-react';
import { Category, Product } from '../types';
import { filterProducts, formatRupiah } from '../utils/orderLogic';
import { useCart } from '../context/CartContext';
import { ProductDetailModal } from './ProductDetailModal';

const CATEGORIES: Category[] = [
  'Semua',
  'Sate Taichan',
  'Paket Hemat',
  'Menu Tambahan',
  'Minuman',
  'Menu Lainnya',
];

export const MenuCatalog: React.FC = () => {
  const { products, addToCart, selectedProductForDetail, setSelectedProductForDetail } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<Category>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);
  const [showOfficialMenuModal, setShowOfficialMenuModal] = useState(false);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, selectedCategory, searchQuery, sortBy);
  }, [products, selectedCategory, searchQuery, sortBy]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.isAvailable) return;
    
    if (product.spicyLevelAvailable) {
      setSelectedProductForDetail(product);
    } else {
      addToCart(product, undefined, undefined, 1);
      setQuickAddedId(product.id);
      setTimeout(() => setQuickAddedId(null), 1200);
    }
  };

  return (
    <section id="menu" className="py-16 lg:py-20 bg-[#FAF7F2] dark:bg-[#121214] text-[#1A1A1A] dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-neutral-800 border border-[#ED1C24]/30 text-[#ED1C24] font-bold text-xs uppercase tracking-widest mb-3 shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-[#ED1C24]" />
            <span>Katalog Resmi & Harga</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
            Pilihan Menu Sate Taichan
          </h2>
          <p className="text-[#555048] dark:text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Disesuaikan secara resmi dengan menu Sate Taichan Rotterdam: Sate Taichan Goreng & Bakar, Sate Kulit, Sate Bakso, Sate Paru, Nasi Jeruk Komplit, Sayap Goreng, hingga Menu Tambahan.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setShowOfficialMenuModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 hover:bg-[#F5F2EB] dark:hover:bg-neutral-700 text-xs font-bold text-[#F39223] border border-[#F39223]/30 rounded-xl transition-all shadow-xs cursor-pointer hover:border-[#F39223]"
            >
              <FileImage className="w-4 h-4" />
              <span>Lihat Lembar Menu Asli (Daftar Lengkap)</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 rounded-2xl p-4 sm:p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari sate, paket hemat, minuman..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-[#1A1A1A] dark:text-white placeholder-neutral-400 text-xs sm:text-sm focus:outline-none focus:border-[#F39223] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Bersihkan pencarian"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#1A1A1A] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 justify-end">
              <SlidersHorizontal className="w-4 h-4 text-[#F39223] shrink-0" />
              <span className="text-xs text-[#555048] dark:text-neutral-300 whitespace-nowrap">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-[#1A1A1A] dark:text-white text-xs sm:text-sm rounded-xl px-3 py-2 focus:outline-none focus:border-[#F39223] transition-colors cursor-pointer"
              >
                <option value="recommended">Menu Favorit / Rekomendasi</option>
                <option value="price-asc">Harga: Termurah ke Tertinggi</option>
                <option value="price-desc">Harga: Tertinggi ke Termurah</option>
              </select>
            </div>
          </div>

          {/* Category Tabs (Segmented Button Controls) */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-[#E8E2D8] dark:border-neutral-800 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#F39223] text-white shadow-xs'
                    : 'bg-[#F5F2EB] dark:bg-neutral-800 text-[#555048] dark:text-neutral-300 hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#EAE5DC] dark:hover:bg-neutral-700 border border-[#E8E2D8] dark:border-neutral-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Count & Query Indicator */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#555048] dark:text-neutral-400 px-1">
          <span>
            Menampilkan <strong className="text-[#1A1A1A] dark:text-white font-bold">{filteredProducts.length}</strong> menu
            {selectedCategory !== 'Semua' && ` di kategori ${selectedCategory}`}
          </span>
          {searchQuery && (
            <span className="text-[#F39223] font-semibold">
              Hasil untuk "{searchQuery}"
            </span>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#E8E2D8] space-y-3 shadow-xs">
            <Flame className="w-10 h-10 text-neutral-300 mx-auto stroke-[1.5]" />
            <h3 className="text-base font-bold text-[#1A1A1A]">Menu tidak ditemukan</h3>
            <p className="text-xs text-[#555048] max-w-sm mx-auto">
              Tidak ada menu yang sesuai dengan kata kunci pencarian Anda. Coba ganti kategori atau bersihkan pencarian.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-[#F5F2EB] hover:bg-[#EAE5DC] text-xs font-semibold text-[#1A1A1A] rounded-xl transition-colors cursor-pointer border border-[#E8E2D8]"
            >
              Tampilkan Semua Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = quickAddedId === product.id;

              const isCutout = [
                'sate_taichan_bakar',
                'sate_kulit_bakar',
                'sate_bakso_bakar',
                'sate_bakso_goreng',
                'nasi_jeruk_komplit',
                'lontong',
                'mineral_water',
              ].some((name) => product.image.includes(name));

              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProductForDetail(product)}
                  className="bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-800 hover:border-[#F39223] dark:hover:border-[#F39223] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer shadow-sm hover:shadow-md"
                >
                  {/* Image Container */}
                  <div className={`relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center ${
                    isCutout ? 'bg-[#FAF7F2] dark:bg-[#201D1A] p-2' : 'bg-neutral-100 dark:bg-neutral-800'
                  }`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full transition-transform duration-500 group-hover:scale-105 ${
                        isCutout ? 'object-contain' : 'object-cover'
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/hero_sate_taichan_1794494904829.jpg';
                      }}
                    />

                    {/* Subtle bottom fade only for scene photos with backgrounds */}
                    {!isCutout && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-60 pointer-events-none" />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {product.isBestSeller && (
                        <span className="bg-[#ED1C24] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-white" />
                          <span>Best Seller</span>
                        </span>
                      )}
                    </div>

                    {/* Out of Stock Overlay */}
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-white/85 dark:bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
                        <span className="text-xs font-black uppercase tracking-wider text-[#ED1C24] px-3 py-1.5 border border-[#ED1C24] rounded-xl bg-white dark:bg-neutral-900 shadow-sm">
                          Habis Terjual
                        </span>
                      </div>
                    )}

                    {/* Quick View Hover Icon */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-2 rounded-full text-white backdrop-blur-sm">
                      <Eye className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Card Content Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-[#F39223] uppercase tracking-wider mb-1">
                        <span>{product.category}</span>
                        {product.portionDetail && (
                          <span className="text-[#6B665E] dark:text-neutral-400 font-normal lowercase">
                            {product.portionDetail}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white group-hover:text-[#F39223] transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#555048] dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-4 mt-4 border-t border-[#E8E2D8] dark:border-neutral-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-[#6B665E] dark:text-neutral-400 block font-medium">Harga</span>
                        <span className="text-base font-black text-[#1A1A1A] dark:text-white tabular-nums">
                          {formatRupiah(product.price)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(product, e)}
                        disabled={!product.isAvailable}
                        aria-label={`Tambah ${product.name} ke pesanan`}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${
                          !product.isAvailable
                            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            : isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#F39223] hover:bg-[#de8016] text-white'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ditambah</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Pesan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Product Detail Modal */}
      {selectedProductForDetail && (
        <ProductDetailModal
          product={selectedProductForDetail}
          onClose={() => setSelectedProductForDetail(null)}
        />
      )}

      {/* Official Menu Sheets Lightbox Modal */}
      {showOfficialMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-4xl bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-[#1A1A1A] dark:text-white">
            <div className="p-4 sm:p-5 border-b border-[#E8E2D8] dark:border-neutral-700 flex items-center justify-between bg-[#FAF7F2] dark:bg-[#201D1A]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F39223]/15 text-[#F39223]">
                  <FileImage className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1A1A1A] dark:text-white">
                    Lembar Menu Resmi Sate Taichan Rotterdam
                  </h3>
                  <p className="text-xs text-[#6B655B] dark:text-neutral-400">
                    Daftar menu asli dan harga resmi kedai Rotterdam
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowOfficialMenuModal(false)}
                className="p-2 text-[#7A7368] hover:text-[#1A1A1A] dark:hover:text-white bg-white dark:bg-neutral-800 rounded-xl border border-[#E8E2D8] dark:border-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FAF7F2] dark:bg-neutral-900 border border-[#E8E2D8] dark:border-neutral-800 rounded-2xl p-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-white mb-2">Halaman 1: Menu Sate Utama</span>
                  <img
                    src="/public/assets/aistudio/menu_taicahn_2_4183eccd.jpg"
                    alt="Menu Sate Taichan Rotterdam Hal 1"
                    className="w-full max-h-[600px] object-contain rounded-xl shadow-xs"
                  />
                </div>
                <div className="bg-[#FAF7F2] dark:bg-neutral-900 border border-[#E8E2D8] dark:border-neutral-800 rounded-2xl p-3 flex flex-col items-center">
                  <span className="text-xs font-bold text-[#1A1A1A] dark:text-white mb-2">Halaman 2: Menu Komplit & Tambahan</span>
                  <img
                    src="/public/assets/aistudio/menu_taichan_6fb1f3fc.jpg"
                    alt="Menu Sate Taichan Rotterdam Hal 2"
                    className="w-full max-h-[600px] object-contain rounded-xl shadow-xs"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8E2D8] dark:border-neutral-800 bg-[#FAF7F2] dark:bg-[#201D1A] flex items-center justify-between text-xs text-[#7A7368] dark:text-neutral-400">
              <span>#PedasnyaBikinNagih • Samping Taman Benteng Rotterdam</span>
              <button
                onClick={() => setShowOfficialMenuModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-[#F39223] to-[#ED1C24] text-white font-bold rounded-xl cursor-pointer"
              >
                Pilih Menu di Katalog
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
