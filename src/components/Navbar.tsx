import React, { useState } from 'react';
import { ShoppingBag, Menu, X, Flame, ShieldCheck, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#151518]/95 backdrop-blur-md border-b border-[#E8E2D8] dark:border-neutral-800 shadow-xs transition-colors duration-300">
      {/* Garis navbar atas penuh menyambung sampai ujung (100% full width, tidak terpotong) */}
      <div className="w-full h-1 bg-gradient-to-r from-[#F39223] via-[#ED1C24] to-[#F39223]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand wordmark & Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
            className="flex items-center gap-3 group shrink-0"
          >
            {/* Official Circular Badge Logo */}
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full overflow-hidden shadow-md group-hover:scale-105 transition-transform shrink-0 border border-[#F39223]/30">
              <img
                src="/public/assets/aistudio/logo_sate_taichan_rotterdam_full.png"
                alt="Logo Sate Taichan Rotterdam"
                className="w-full h-full object-cover scale-[1.04]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-[#1A1A1A] dark:text-white uppercase font-sans">
                  SATE TAICHAN <span className="text-[#F39223]">ROTTERDAM</span>
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#ED1C24] flex items-center gap-1 tracking-wide">
                <Flame className="w-3 h-3 fill-[#ED1C24]" /> #PedasnyaBikinNagih
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#555048] dark:text-neutral-300">
            <button
              onClick={() => handleNavClick('hero')}
              className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Beranda
            </button>
            <button
              onClick={() => handleNavClick('menu')}
              className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Katalog Menu
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Tentang Kami
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Galeri
            </button>
            <button
              onClick={() => handleNavClick('location')}
              className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Lokasi & Jam Buka
            </button>
          </nav>

          {/* Zone 3: Actions (Theme Toggle + Shopping Bag + Order Button) */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
              aria-label="Toggle tema gelap dan terang"
              className="p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-neutral-800 text-[#1A1A1A] dark:text-neutral-200 hover:text-[#F39223] dark:hover:text-[#F39223] border border-[#E8E2D8] dark:border-neutral-700 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-600" />
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Lihat keranjang pesanan (${totalItems} item)`}
              className="relative p-2.5 bg-[#F5F2EB] dark:bg-neutral-800 hover:bg-[#EAE5DC] dark:hover:bg-neutral-700 border border-[#E8E2D8] dark:border-neutral-700 rounded-xl text-[#1A1A1A] dark:text-white transition-all cursor-pointer flex items-center gap-2 group shadow-xs"
            >
              <ShoppingBag className="w-5 h-5 text-[#F39223] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline text-xs font-bold text-[#1A1A1A] dark:text-white">Keranjang</span>
              {totalItems > 0 && (
                <span className="bg-[#ED1C24] text-white font-extrabold text-[11px] min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center shadow-md">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Primary Order CTA */}
            <button
              onClick={() => handleNavClick('menu')}
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-[#F39223] hover:bg-[#de8016] text-white text-xs font-bold rounded-xl shadow-sm active:scale-95 transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Flame className="w-4 h-4 fill-white" />
              <span>Pesan Sekarang</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="md:hidden p-2 text-[#1A1A1A] dark:text-white hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 rounded-xl border border-[#E8E2D8] dark:border-neutral-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#18181B] border-b border-[#E8E2D8] dark:border-neutral-800 px-4 py-5 space-y-3 shadow-lg">
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E8E2D8] dark:border-neutral-800 text-xs font-semibold">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Halal Certified Indonesia</span>
            </div>

            {/* Mobile Mode Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs font-bold text-[#1A1A1A] dark:text-neutral-200"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-600" />}
              <span>{theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}</span>
            </button>
          </div>

          <button
            onClick={() => handleNavClick('hero')}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#1A1A1A] dark:text-neutral-200 hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 rounded-lg"
          >
            Beranda
          </button>
          <button
            onClick={() => handleNavClick('menu')}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#1A1A1A] dark:text-neutral-200 hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 rounded-lg"
          >
            Katalog Menu
          </button>
          <button
            onClick={() => handleNavClick('about')}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#1A1A1A] dark:text-neutral-200 hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 rounded-lg"
          >
            Tentang Kami
          </button>
          <button
            onClick={() => handleNavClick('gallery')}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#1A1A1A] dark:text-neutral-200 hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 rounded-lg"
          >
            Galeri
          </button>
          <button
            onClick={() => handleNavClick('location')}
            className="w-full text-left py-2 px-3 text-sm font-semibold text-[#1A1A1A] dark:text-neutral-200 hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 rounded-lg"
          >
            Lokasi & Jam Buka
          </button>
        </div>
      )}
    </header>
  );
};
