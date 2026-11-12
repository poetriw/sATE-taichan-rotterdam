import React, { useState } from 'react';
import { X, Plus, Minus, Flame, ShoppingBag, CheckCircle } from 'lucide-react';
import { Product, SpicyLevel } from '../types';
import { formatRupiah } from '../utils/orderLogic';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [spicyLevel, setSpicyLevel] = useState<SpicyLevel>('Pedas');
  const [customNotes, setCustomNotes] = useState('');
  const [showSuccessNotice, setShowSuccessNotice] = useState(false);

  const handleAdd = () => {
    addToCart(
      product,
      product.spicyLevelAvailable ? spicyLevel : undefined,
      customNotes.trim() ? customNotes : undefined,
      quantity
    );
    setShowSuccessNotice(true);
    setTimeout(() => {
      setShowSuccessNotice(false);
      onClose();
    }, 600);
  };

  const itemSubtotal = product.price * quantity;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 rounded-3xl overflow-hidden shadow-2xl text-[#1A1A1A] dark:text-white z-10 flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup detail produk"
          className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 text-[#1A1A1A] dark:text-white rounded-full transition-colors cursor-pointer border border-[#E8E2D8] dark:border-neutral-700 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Header */}
        <div className={`relative aspect-[16/9] w-full overflow-hidden shrink-0 flex items-center justify-center ${
          isCutout ? 'bg-[#FAF7F2] dark:bg-[#201D1A] p-3' : 'bg-neutral-100 dark:bg-neutral-800'
        }`}>
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full ${isCutout ? 'object-contain' : 'object-cover'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/src/assets/images/hero_sate_taichan_1794494904829.jpg';
            }}
          />
          {!isCutout && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 pointer-events-none" />
          )}
          
          {product.isBestSeller && (
            <div className="absolute bottom-3 left-4 bg-[#ED1C24] text-white text-[11px] font-black uppercase px-3 py-1 rounded-md flex items-center gap-1 shadow-md">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>Menu Favorit / Best Seller</span>
            </div>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-[#F39223] uppercase tracking-widest">
                {product.category}
              </span>
              <span className="text-xl font-black text-[#1A1A1A] dark:text-white">
                {formatRupiah(product.price)}
              </span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1A1A] dark:text-white mt-1">
              {product.name}
            </h3>

            {product.portionDetail && (
              <p className="text-xs text-[#6B665E] dark:text-neutral-400 font-medium mt-1">
                Isi: {product.portionDetail}
              </p>
            )}

            <p className="text-sm text-[#555048] dark:text-neutral-300 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Spicy Level Selector (if applicable) */}
          {product.spicyLevelAvailable && (
            <div className="pt-2 border-t border-[#E8E2D8] dark:border-neutral-800 space-y-2">
              <label className="text-xs font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#F39223]" />
                <span>Pilih Level Pedas Sambal:</span>
              </label>

              <div className="grid grid-cols-3 gap-2">
                {(['Sedang', 'Pedas', 'Ekstra Pedas'] as SpicyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpicyLevel(lvl)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      spicyLevel === lvl
                        ? 'bg-gradient-to-r from-[#F39223] to-[#ED1C24] border-[#F39223] text-white shadow-xs'
                        : 'bg-[#FAF7F2] dark:bg-neutral-800 border-[#E8E2D8] dark:border-neutral-700 text-[#555048] dark:text-neutral-300 hover:border-[#F39223]'
                    }`}
                  >
                    <span>{lvl}</span>
                    <span className="text-[10px] font-normal opacity-85">
                      {lvl === 'Sedang' ? 'Gurih Nikmat' : lvl === 'Pedas' ? 'Pedas Khas' : 'Pedas Nampol'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#1A1A1A] dark:text-white block">
              Catatan Khusus (Opsional):
            </label>
            <textarea
              rows={2}
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="Contoh: Sambal dipisah, perbanyak perasan jeruk nipis, bumbu agak gurih..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs text-[#1A1A1A] dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#F39223] transition-colors"
            />
          </div>

          {/* Quantity Controls */}
          <div className="pt-2 border-t border-[#E8E2D8] dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">Jumlah Porsi:</span>
            <div className="flex items-center gap-3 bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 rounded-xl px-3 py-1.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Kurangi jumlah"
                className="p-1 text-[#555048] dark:text-neutral-300 hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-extrabold text-sm w-6 text-center text-[#1A1A1A] dark:text-white">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Tambah jumlah"
                className="p-1 text-[#555048] dark:text-neutral-300 hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#E8E2D8] dark:border-neutral-800 bg-[#FAF7F2] dark:bg-[#151518] flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#6B665E] dark:text-neutral-400 block">Subtotal</span>
            <span className="text-lg font-black text-[#1A1A1A] dark:text-white">
              {formatRupiah(itemSubtotal)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.isAvailable}
            className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
              !product.isAvailable
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                : showSuccessNotice
                ? 'bg-emerald-600 text-white'
                : 'bg-gradient-to-r from-[#F39223] to-[#ED1C24] hover:brightness-110 text-white active:scale-95'
            }`}
          >
            {showSuccessNotice ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Berhasil Ditambahkan!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Pesanan ({quantity})</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
