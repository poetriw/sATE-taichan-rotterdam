import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  calculateCartTotals,
  generateWhatsAppOrderMessage,
  filterProducts,
  getMakassarOperatingStatus,
} from './orderLogic';
import { CartItem, Product } from '../types';

test('formatRupiah formats numbers into IDR standard correctly', () => {
  assert.equal(formatRupiah(25000), 'Rp\u00a025.000');
  assert.equal(formatRupiah(0), 'Rp\u00a00');
});

test('calculateCartTotals calculates quantities and subtotal accurately', () => {
  const mockProduct1: Product = {
    id: 'p1',
    name: 'Sate Taichan Daging',
    category: 'Sate Taichan',
    price: 25000,
    description: '10 tusuk taichan',
    image: '',
    isBestSeller: true,
    isAvailable: true,
  };

  const mockProduct2: Product = {
    id: 'p2',
    name: 'Lontong',
    category: 'Menu Tambahan',
    price: 5000,
    description: 'Lontong pulen',
    image: '',
    isBestSeller: false,
    isAvailable: true,
  };

  const cart: CartItem[] = [
    { id: 'c1', product: mockProduct1, quantity: 2 },
    { id: 'c2', product: mockProduct2, quantity: 3 },
  ];

  const totals = calculateCartTotals(cart);
  assert.equal(totals.totalItems, 5);
  assert.equal(totals.totalPrice, 2 * 25000 + 3 * 5000); // 50000 + 15000 = 65000
});

test('generateWhatsAppOrderMessage builds expected encoded URL and structured text', () => {
  const mockProduct: Product = {
    id: 'p1',
    name: 'Sate Taichan Daging',
    category: 'Sate Taichan',
    price: 25000,
    description: '10 tusuk taichan',
    image: '',
    isBestSeller: true,
    isAvailable: true,
  };

  const cart: CartItem[] = [
    {
      id: 'c1',
      product: mockProduct,
      quantity: 2,
      spicyLevel: 'Pedas',
      notes: 'Sambal dipisah',
    },
  ];

  const details = {
    customerName: 'Ahmad Faiz',
    customerPhone: '08123456789',
    orderType: 'dine-in' as const,
    tableOrAddress: 'Meja 05',
    generalNotes: 'Jeruk nipis tambah 1',
  };

  const result = generateWhatsAppOrderMessage(cart, details, '6281234567890');
  assert.ok(result.message.includes('SATE TAICHAN ROTTERDAM'));
  assert.ok(result.message.includes('Ahmad Faiz'));
  assert.ok(result.message.includes('Meja 05'));
  assert.ok(result.message.includes('Sate Taichan Daging'));
  assert.ok(result.message.includes('Pedas'));
  assert.ok(result.message.includes('#PedasnyaBikinNagih'));
  assert.ok(result.url.startsWith('https://wa.me/6281234567890?text='));
});

test('filterProducts handles category filter and search', () => {
  const products: Product[] = [
    {
      id: '1',
      name: 'Sate Taichan Daging',
      category: 'Sate Taichan',
      price: 25000,
      description: 'Daging ayam gurih',
      image: '',
      isBestSeller: true,
      isAvailable: true,
    },
    {
      id: '2',
      name: 'Es Jeruk Nipis',
      category: 'Minuman',
      price: 8000,
      description: 'Segar dingin',
      image: '',
      isBestSeller: false,
      isAvailable: true,
    },
  ];

  const filteredByCategory = filterProducts(products, 'Minuman', '', 'recommended');
  assert.equal(filteredByCategory.length, 1);
  assert.equal(filteredByCategory[0].name, 'Es Jeruk Nipis');

  const filteredBySearch = filterProducts(products, 'Semua', 'daging', 'recommended');
  assert.equal(filteredBySearch.length, 1);
  assert.equal(filteredBySearch[0].name, 'Sate Taichan Daging');
});

test('getMakassarOperatingStatus returns open/close status based on time', () => {
  // Test 18:00 UTC (which is 02:00 next day in Makassar UTC+8 -> closed)
  const midnightUtc = new Date(Date.UTC(2026, 10, 12, 19, 0, 0));
  const res1 = getMakassarOperatingStatus(midnightUtc);
  assert.equal(typeof res1.isOpen, 'boolean');

  // Test 10:00 UTC (which is 18:00 Makassar -> OPEN)
  const openTimeUtc = new Date(Date.UTC(2026, 10, 12, 10, 0, 0));
  const res2 = getMakassarOperatingStatus(openTimeUtc);
  assert.equal(res2.isOpen, true);
  assert.ok(res2.statusText.includes('Buka Sekarang'));
});
