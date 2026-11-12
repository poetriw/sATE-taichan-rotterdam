import { CartItem, Category, OperatingStatus, OrderDetails, Product } from '../types';

/**
 * Format currency into standard Indonesian Rupiah notation
 */
export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate total quantity and totalPrice of cart
 */
export function calculateCartTotals(cart: CartItem[]): { totalItems: number; totalPrice: number } {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { totalItems, totalPrice };
}

/**
 * Generate formatted WhatsApp order message according to brand identity and specifications
 */
export function generateWhatsAppOrderMessage(
  cart: CartItem[],
  details: OrderDetails,
  businessPhone: string
): { message: string; url: string } {
  const cleanPhone = businessPhone.replace(/\D/g, '');
  const { totalPrice } = calculateCartTotals(cart);

  const orderTypeLabel = details.orderType === 'dine-in' 
    ? 'Dine-In (Makan di Tempat)' 
    : 'Takeaway (Bungkus / Bawa Pulang)';

  let text = `*HALO SATE TAICHAN ROTTERDAM!* 🔥\n`;
  text += `Saya ingin melakukan pemesanan via Website Resmi:\n\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*INFORMASI PEMESAN*\n`;
  text += `• Nama: *${details.customerName.trim()}*\n`;
  if (details.customerPhone) {
    text += `• No. Telepon: ${details.customerPhone.trim()}\n`;
  }
  text += `• Tipe Pesanan: *${orderTypeLabel}*\n`;
  if (details.tableOrAddress && details.tableOrAddress.trim()) {
    text += `• ${details.orderType === 'dine-in' ? 'No. Meja' : 'Alamat/Lokasi'}: ${details.tableOrAddress.trim()}\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*DAFTAR PESANAN*\n`;

  cart.forEach((item, index) => {
    const itemSubtotal = item.product.price * item.quantity;
    text += `${index + 1}. *${item.product.name}*\n`;
    text += `   ${item.quantity}x @ ${formatRupiah(item.product.price)} = *${formatRupiah(itemSubtotal)}*\n`;
    if (item.spicyLevel) {
      text += `   ↳ Level Pedas: ${item.spicyLevel}\n`;
    }
    if (item.notes && item.notes.trim()) {
      text += `   ↳ Catatan: ${item.notes.trim()}\n`;
    }
  });

  text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*TOTAL PEMBAYARAN: ${formatRupiah(totalPrice)}*\n`;

  if (details.generalNotes && details.generalNotes.trim()) {
    text += `\n*Catatan Khusus Pesanan:*\n"${details.generalNotes.trim()}"\n`;
  }

  text += `\n#PedasnyaBikinNagih\n`;
  text += `Mohon konfirmasi ketersediaan dan instruksi pembayaran/penyajian. Terima kasih!`;

  const encoded = encodeURIComponent(text);
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

  return { message: text, url };
}

/**
 * Filter and sort products
 */
export function filterProducts(
  products: Product[],
  selectedCategory: Category,
  searchQuery: string,
  sortBy: 'recommended' | 'price-asc' | 'price-desc'
): Product[] {
  const query = searchQuery.trim().toLowerCase();

  return products
    .filter((product) => {
      const matchCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      const matchSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Recommended: best sellers first, then available items first
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;
      return 0;
    });
}

/**
 * Check Makassar operating status (WITA = UTC+8)
 * Senin–Sabtu: 17.00–23.30 WITA
 * Malam Minggu (Sabtu malam): 17.00–24.00 WITA
 */
export function getMakassarOperatingStatus(referenceDate: Date = new Date()): OperatingStatus {
  // Convert current referenceDate to Makassar time (UTC+8)
  const utc = referenceDate.getTime() + referenceDate.getTimezoneOffset() * 60000;
  const makassarDate = new Date(utc + 3600000 * 8);

  const dayOfWeek = makassarDate.getDay(); // 0 = Minggu, 6 = Sabtu
  const hours = makassarDate.getHours();
  const minutes = makassarDate.getMinutes();
  const currentTimeInMinutes = hours * 60 + minutes;

  // Operating window definition:
  // Saturday night (Malam Minggu) closes at 24:00 (1440 min)
  // All other days close at 23:30 (1410 min)
  const openTimeInMinutes = 17 * 60; // 17:00 = 1020 min
  const isSaturday = dayOfWeek === 6;
  const closeTimeInMinutes = isSaturday ? 24 * 60 : 23 * 60 + 30; // 24:00 or 23:30

  const isOpen = currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes < closeTimeInMinutes;

  if (isOpen) {
    const closingTimeStr = isSaturday ? '24.00 WITA' : '23.30 WITA';
    return {
      isOpen: true,
      statusText: `Buka Sekarang (Tutup ${closingTimeStr})`,
      closingTime: closingTimeStr,
    };
  } else {
    return {
      isOpen: false,
      statusText: `Tutup Sekarang (Buka 17.00 WITA)`,
      openingTime: '17.00 WITA',
    };
  }
}
