import React from 'react';
import { Flame, ShieldCheck, MapPin, Clock, Instagram, Share2, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const { businessSettings } = useCart();

  return (
    <footer className="bg-[#EFE8DC] dark:bg-[#101012] border-t border-[#DFD8CC] dark:border-neutral-800 text-[#5A554E] dark:text-neutral-400 py-12 lg:py-16 text-xs sm:text-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-md border border-[#F39223]/30">
                <img
                  src="/public/assets/aistudio/logo_sate_taichan_rotterdam_full.png"
                  alt="Logo Resmi Sate Taichan Rotterdam"
                  className="w-full h-full object-cover scale-[1.04]"
                />
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#1A1A1A] dark:text-white tracking-tight">
                  SATE TAICHAN <span className="text-[#F39223]">ROTTERDAM</span>
                </h4>
                <p className="text-xs font-bold text-[#ED1C24] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-[#ED1C24]" /> #PedasnyaBikinNagih
                </p>
              </div>
            </div>

            <p className="text-xs text-[#5A554E] dark:text-neutral-400 leading-relaxed max-w-sm">
              Kuliner street food sate taichan khas Makassar dengan bumbu gurih meresap, daging ayam empuk juicy, dan sambal ulek pedas nagih.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 rounded-full text-emerald-800 dark:text-emerald-300 text-xs font-semibold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
              <span>100% Halal Certified Indonesia</span>
            </div>
          </div>

          {/* Quick Nav Links (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h5 className="font-bold text-[#1A1A1A] dark:text-white text-xs uppercase tracking-widest">
              Navigasi Halaman
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#hero" className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors">
                  Katalog Menu & Harga
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors">
                  Cerita & Kualitas Produk
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors">
                  Galeri Makanan & Suasana
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors">
                  Lokasi & Petunjuk Arah
                </a>
              </li>
            </ul>
          </div>

          {/* Operational & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h5 className="font-bold text-[#1A1A1A] dark:text-white text-xs uppercase tracking-widest">
              Kedai & Kontak Pemesanan
            </h5>
            <div className="space-y-2 text-xs">
              <p className="flex items-start gap-2 text-[#4A4640] dark:text-neutral-300">
                <MapPin className="w-4 h-4 text-[#F39223] shrink-0 mt-0.5" />
                <span>{businessSettings.address}</span>
              </p>
              <p className="flex items-start gap-2 text-[#4A4640] dark:text-neutral-300">
                <Clock className="w-4 h-4 text-[#ED1C24] shrink-0 mt-0.5" />
                <span>Buka setiap sore: 17.00 – 23.30 WITA (Malam Minggu s/d 24.00)</span>
              </p>
              <p className="flex items-center gap-2 text-[#4A4640] dark:text-neutral-300">
                <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>WhatsApp: +{businessSettings.whatsappNumber}</span>
              </p>
            </div>

            {/* Social icons */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/satetaichan.rotterdam"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram @satetaichan.rotterdam"
                className="p-2 bg-white dark:bg-neutral-800 hover:bg-[#F5F2EB] dark:hover:bg-neutral-700 border border-[#DFD8CC] dark:border-neutral-700 rounded-xl text-[#1A1A1A] dark:text-neutral-200 hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors shadow-xs"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://tiktok.com/@satetaichanrotterdam"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok @satetaichanrotterdam"
                className="p-2 bg-white dark:bg-neutral-800 hover:bg-[#F5F2EB] dark:hover:bg-neutral-700 border border-[#DFD8CC] dark:border-neutral-700 rounded-xl text-[#1A1A1A] dark:text-neutral-200 hover:text-[#F39223] dark:hover:text-[#F39223] transition-colors shadow-xs"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Tagline Bar */}
        <div className="pt-8 border-t border-[#DFD8CC] dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A746A] dark:text-neutral-500">
          <p>
            © {new Date().getFullYear()} Sate Taichan Rotterdam Makassar. Seluruh hak cipta dilindungi.
          </p>

          <div className="flex items-center gap-2 text-[#F39223] font-bold">
            <span className="text-[#1A1A1A] dark:text-neutral-300">Modern Street Food Makassar</span>
            <span>·</span>
            <span className="text-[#ED1C24]">#PedasnyaBikinNagih</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
