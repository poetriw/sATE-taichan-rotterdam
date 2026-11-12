import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, MessageCircle, AlertCircle, Utensils, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatRupiah } from '../utils/orderLogic';
import { OrderDetails } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
    businessSettings,
    sendWhatsAppOrder,
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isCartOpen) return null;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setErrorMessage('Harap masukkan nama pemesan terlebih dahulu.');
      return;
    }

    setErrorMessage('');

    const orderData: OrderDetails = {
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      orderType,
      tableOrAddress: tableOrAddress.trim(),
      generalNotes: generalNotes.trim(),
    };

    sendWhatsAppOrder(orderData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
        <div className="w-screen max-w-md bg-white dark:bg-[#18181B] border-l border-[#E8E2D8] dark:border-neutral-800 text-[#1A1A1A] dark:text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E2D8] dark:border-neutral-800 flex items-center justify-between bg-[#FAF7F2] dark:bg-[#151518]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#F39223]/15 border border-[#F39223]/30 text-[#F39223]">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#1A1A1A] dark:text-white">Keranjang Pesanan</h3>
                <span className="text-[11px] text-[#7A7368] dark:text-neutral-400 font-medium">
                  {totalItems} item dipilih
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              aria-label="Tutup keranjang pesanan"
              className="p-2 text-[#7A7368] hover:text-[#1A1A1A] dark:text-neutral-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white dark:bg-[#18181B]">
            {cart.length === 0 ? (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 flex items-center justify-center text-[#9E988E]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="text-base font-bold text-[#1A1A1A] dark:text-white">Keranjang Anda Masih Kosong</h4>
                <p className="text-xs text-[#6B655B] dark:text-neutral-400 max-w-xs leading-relaxed">
                  Pilih menu sate taichan daging, kulit crispy, atau paket hemat favorit Anda untuk memulai pesanan.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#F39223] to-[#ED1C24] hover:brightness-105 text-white font-bold text-xs shadow-md shadow-[#F39223]/25 cursor-pointer"
                >
                  Buka Katalog Menu
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#7A7368] dark:text-neutral-400 pb-1">
                    <span>Menu Terpilih</span>
                    <button
                      type="button"
                      onClick={clearCart}
                      className="text-[#ED1C24] hover:underline font-semibold cursor-pointer"
                    >
                      Kosongkan Semua
                    </button>
                  </div>

                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FAF7F2] dark:bg-neutral-850 dark:bg-[#201D1A] border border-[#E8E2D8] dark:border-neutral-750 dark:border-neutral-700 rounded-2xl p-3.5 space-y-2.5 transition-all shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-white leading-snug">
                            {item.product.name}
                          </h4>
                          <span className="text-xs font-extrabold text-[#F39223]">
                            {formatRupiah(item.product.price)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Hapus ${item.product.name}`}
                          className="p-1.5 text-[#9E988E] hover:text-[#ED1C24] hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Modifiers info (spicy level & notes) */}
                      {(item.spicyLevel || item.notes) && (
                        <div className="text-[11px] bg-white dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 rounded-lg p-2 text-[#555048] dark:text-neutral-300 space-y-1">
                          {item.spicyLevel && (
                            <p className="flex items-center gap-1.5">
                              <span className="text-[#F39223] font-bold">Level Pedas:</span>
                              <span>{item.spicyLevel}</span>
                            </p>
                          )}
                          {item.notes && (
                            <p className="flex items-start gap-1.5 text-[#6B655B] dark:text-neutral-400 italic">
                              <span>Catatan:</span>
                              <span>"{item.notes}"</span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* Stepper & Item Subtotal */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D8] dark:border-neutral-700">
                        <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 rounded-xl px-2 py-1 shadow-xs">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Kurangi porsi"
                            className="p-1 text-[#6B655B] dark:text-neutral-300 hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold w-5 text-center text-[#1A1A1A] dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Tambah porsi"
                            className="p-1 text-[#6B655B] dark:text-neutral-300 hover:text-[#1A1A1A] dark:hover:text-white transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-[#1A1A1A] dark:text-white tabular-nums">
                            {formatRupiah(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Customer Checkout Form */}
                <form id="cart-order-form" onSubmit={handleCheckout} className="pt-4 border-t border-[#E8E2D8] dark:border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#F39223]">
                      Rincian Pelanggan & Pengambilan
                    </h4>
                  </div>

                  {/* Customer Name */}
                  <div>
                    <label className="text-xs font-semibold text-[#555048] dark:text-neutral-300 block mb-1">
                      Nama Pemesan <span className="text-[#ED1C24]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Contoh: Andi Pratama"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs sm:text-sm text-[#1A1A1A] dark:text-white placeholder-[#9E988E] focus:outline-none focus:border-[#F39223] transition-colors"
                    />
                  </div>

                  {/* Customer Phone (optional) */}
                  <div>
                    <label className="text-xs font-semibold text-[#555048] dark:text-neutral-300 block mb-1">
                      No. WhatsApp / Telepon (Opsional)
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Contoh: 0812xxxxxxxx"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs sm:text-sm text-[#1A1A1A] dark:text-white placeholder-[#9E988E] focus:outline-none focus:border-[#F39223] transition-colors"
                    />
                  </div>

                  {/* Order Type Selector */}
                  <div>
                    <label className="text-xs font-semibold text-[#555048] dark:text-neutral-300 block mb-1.5">
                      Jenis Pesanan
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setOrderType('dine-in')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          orderType === 'dine-in'
                            ? 'bg-gradient-to-r from-[#F39223] to-[#ED1C24] border-[#F39223] text-white shadow-sm'
                            : 'bg-[#F5F2EB] dark:bg-neutral-800 border-[#E8E2D8] dark:border-neutral-700 text-[#6B655B] dark:text-neutral-300 hover:text-[#1A1A1A] dark:hover:text-white'
                        }`}
                      >
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Dine-In (Di Tempat)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType('takeaway')}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          orderType === 'takeaway'
                            ? 'bg-gradient-to-r from-[#F39223] to-[#ED1C24] border-[#F39223] text-white shadow-sm'
                            : 'bg-[#F5F2EB] dark:bg-neutral-800 border-[#E8E2D8] dark:border-neutral-700 text-[#6B655B] dark:text-neutral-300 hover:text-[#1A1A1A] dark:hover:text-white'
                        }`}
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>Takeaway (Bungkus)</span>
                      </button>
                    </div>
                  </div>

                  {/* Table Number or Pickup / Delivery notes */}
                  <div>
                    <label className="text-xs font-semibold text-[#555048] dark:text-neutral-300 block mb-1">
                      {orderType === 'dine-in'
                        ? 'Nomor Meja (Bila Sudah Duduk di Lokasi)'
                        : 'Alamat Pengantaran / Jam Penjemputan'}
                    </label>
                    <input
                      type="text"
                      value={tableOrAddress}
                      onChange={(e) => setTableOrAddress(e.target.value)}
                      placeholder={
                        orderType === 'dine-in'
                          ? 'Contoh: Meja 05 outdoor'
                          : 'Contoh: Ambil sendiri pukul 19.30 atau Jl. Somba Opu'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs sm:text-sm text-[#1A1A1A] dark:text-white placeholder-[#9E988E] focus:outline-none focus:border-[#F39223] transition-colors"
                    />
                  </div>

                  {/* General Notes */}
                  <div>
                    <label className="text-xs font-semibold text-[#555048] dark:text-neutral-300 block mb-1">
                      Catatan Tambahan untuk Kasir / Dapur
                    </label>
                    <textarea
                      rows={2}
                      value={generalNotes}
                      onChange={(e) => setGeneralNotes(e.target.value)}
                      placeholder="Contoh: Sambal dipisah semua, tambah jeruk nipis, bumbu kaldu agak banyak..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs text-[#1A1A1A] dark:text-white placeholder-[#9E988E] focus:outline-none focus:border-[#F39223] transition-colors"
                    />
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-2 p-2.5 bg-red-50 dark:bg-red-950/40 border border-[#ED1C24]/30 rounded-xl text-xs text-[#ED1C24] dark:text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0 text-[#ED1C24]" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>

          {/* Drawer Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#E8E2D8] dark:border-neutral-800 bg-[#FAF7F2] dark:bg-[#151518] space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6B655B] dark:text-neutral-400 font-medium">Total Pembayaran</span>
                <span className="text-xl font-black text-[#1A1A1A] dark:text-white tabular-nums">
                  {formatRupiah(totalPrice)}
                </span>
              </div>

              <button
                type="submit"
                form="cart-order-form"
                className="w-full py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#16A34A]/25 active:scale-98 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Kirim Pesanan ke WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-[#7A7368] dark:text-neutral-400 text-center leading-relaxed">
                Pesan WhatsApp otomatis terformat ke kasir resmi ({businessSettings.whatsappNumber}).
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
