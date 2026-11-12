import React, { useState, useEffect } from 'react';
import { Flame, ShieldCheck, MapPin, Clock, ArrowRight, MessageSquare, Sparkles, Image as ImageIcon } from 'lucide-react';
import { getMakassarOperatingStatus } from '../utils/orderLogic';
import { useCart } from '../context/CartContext';
import { ThreeTaichanCanvas } from './ThreeTaichanCanvas';

export const Hero: React.FC = () => {
  const [operatingStatus, setOperatingStatus] = useState(() => getMakassarOperatingStatus());
  const { setIsCartOpen } = useCart();
  const [visualMode, setVisualMode] = useState<'3d' | 'photo'>('3d');
  const [selectedSpicyLevel, setSelectedSpicyLevel] = useState<number>(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setOperatingStatus(getMakassarOperatingStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const spicyLevels = [
    { level: 1, name: 'Santai', rawit: '3 Rawit', desc: 'Pedas gurih ramah pemula', color: 'from-amber-400 to-orange-500' },
    { level: 2, name: 'Nagih', rawit: '8 Rawit', desc: 'Rekomendasi khas Rotterdam!', color: 'from-orange-500 to-red-500' },
    { level: 3, name: 'Meledak', rawit: '15+ Rawit', desc: 'Nampol juara keringat mengucur 🔥', color: 'from-red-600 to-rose-700' },
  ];

  return (
    <section id="hero" className="relative min-h-[82vh] flex flex-col justify-between bg-[#FAF7F2] dark:bg-[#121214] pt-8 pb-0 border-b border-[#E8E2D8] dark:border-neutral-800 transition-colors duration-300 overflow-hidden">
      
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#F39223]/10 dark:bg-[#F39223]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#ED1C24]/10 dark:bg-[#ED1C24]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex-1 flex items-center py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center w-full">
          
          {/* Left Column: Headlines, Brand Badge & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Trust badge & Makassar Live Status */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-emerald-700 dark:text-emerald-400 text-xs font-semibold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Halal Certified Indonesia</span>
              </span>

              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold shadow-xs ${
                operatingStatus.isOpen 
                  ? 'bg-white dark:bg-neutral-800 border-[#F39223]/50 text-[#F39223]' 
                  : 'bg-white dark:bg-neutral-800 border-[#E8E2D8] dark:border-neutral-700 text-neutral-500 dark:text-neutral-400'
              }`}>
                <span className={`w-2 h-2 rounded-full ${operatingStatus.isOpen ? 'bg-[#F39223] animate-ping' : 'bg-neutral-400'}`} />
                <span>{operatingStatus.statusText}</span>
              </span>
            </div>

            {/* Official Logo Badge & Tagline Lockup */}
            <div className="flex items-center justify-center lg:justify-start pt-1">
              <div className="inline-flex items-center gap-3.5 p-2 pr-5 bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 rounded-2xl shadow-sm">
                <div className="w-13 h-13 rounded-full overflow-hidden shrink-0 shadow-sm border border-[#F39223]/30">
                  <img
                    src="/public/assets/aistudio/logo_sate_taichan_rotterdam_full.png"
                    alt="Logo Sate Taichan Rotterdam"
                    className="w-full h-full object-cover scale-[1.04]"
                  />
                </div>
                <div className="text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[#6B665E] dark:text-neutral-400">
                    Official Brand • Benteng Rotterdam
                  </span>
                  <div className="font-black text-sm sm:text-base flex items-center gap-1">
                    <span className="text-[#F39223]">#Pedasnya</span>
                    <span className="text-[#ED1C24]">BikinNagih</span>
                    <Flame className="w-3.5 h-3.5 fill-[#ED1C24] text-[#ED1C24] ml-0.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1A1A1A] dark:text-white tracking-tight leading-[1.12] [text-wrap:balance]">
              Pedasnya <span className="text-[#F39223]">Bikin Nagih</span>, Rasanya Bikin Balik Lagi!
            </h1>

            {/* Subheadline */}
            <p className="text-[#555048] dark:text-neutral-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Sensasi sate taichan daging ayam empuk juicy dibakar fresh dengan bumbu gurih meresap dan sambal rawit ulek pedas segar racikan khas Rotterdam di samping Taman Benteng Rotterdam, Makassar.
            </p>

            {/* Interactive Spicy Level Meter Preview */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 shadow-xs max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-bold text-[#1A1A1A] dark:text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#ED1C24] fill-[#ED1C24]" />
                  <span>Pilih Karakter Pedas Anda:</span>
                </span>
                <span className="text-[11px] font-semibold text-[#F39223]">
                  {spicyLevels.find((s) => s.level === selectedSpicyLevel)?.rawit}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {spicyLevels.map((sp) => (
                  <button
                    key={sp.level}
                    type="button"
                    onClick={() => setSelectedSpicyLevel(sp.level)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center border ${
                      selectedSpicyLevel === sp.level
                        ? 'bg-gradient-to-r text-white shadow-sm border-transparent ' + sp.color
                        : 'bg-[#FAF7F2] dark:bg-neutral-800 text-[#555048] dark:text-neutral-300 border-[#E8E2D8] dark:border-neutral-700 hover:border-[#F39223]'
                    }`}
                  >
                    <span>Lvl {sp.level} {sp.name}</span>
                    <span className="text-[10px] opacity-85 font-normal">{sp.rawit}</span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2 text-center lg:text-left italic">
                "{spicyLevels.find((s) => s.level === selectedSpicyLevel)?.desc}"
              </p>
            </div>

            {/* Location & Hours Quick Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-xs text-[#4A4640] dark:text-neutral-300">
              <div className="flex items-center gap-2 bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 px-3.5 py-2 rounded-xl shadow-xs">
                <MapPin className="w-4 h-4 text-[#F39223] shrink-0" />
                <span>Jl. WR Supratman (Samping Benteng Rotterdam)</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 px-3.5 py-2 rounded-xl shadow-xs">
                <Clock className="w-4 h-4 text-[#ED1C24] shrink-0" />
                <span>Senin–Sabtu 17.00–23.30 | Malam Minggu s/d 24.00</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={scrollToMenu}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#F39223] hover:bg-[#de8016] text-white font-bold text-sm shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 fill-white" />
                <span>Lihat Katalog & Harga</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white dark:bg-[#18181B] hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-[#1A1A1A] dark:text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-[#F39223]" />
                <span>Pesan Sekarang (WhatsApp)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Interactive 3D Grill or Photo Food Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* View Switcher Pills */}
            <div className="mb-3.5 inline-flex items-center p-1 bg-white dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 rounded-2xl shadow-xs">
              <button
                type="button"
                onClick={() => setVisualMode('3d')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  visualMode === '3d'
                    ? 'bg-gradient-to-r from-[#F39223] to-[#ED1C24] text-white shadow-xs'
                    : 'text-[#555048] dark:text-neutral-300 hover:text-[#1A1A1A]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>3D Grill 360°</span>
              </button>

              <button
                type="button"
                onClick={() => setVisualMode('photo')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  visualMode === 'photo'
                    ? 'bg-[#F39223] text-white shadow-xs'
                    : 'text-[#555048] dark:text-neutral-300 hover:text-[#1A1A1A]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Foto Real Menu</span>
              </button>
            </div>

            {/* Display either 3D Interactive Canvas or Photo Card */}
            <div className="w-full max-w-md lg:max-w-none">
              {visualMode === '3d' ? (
                <ThreeTaichanCanvas />
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-neutral-700 bg-white dark:bg-[#18181B] p-3 shadow-md group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black">
                    <img
                      src="/src/assets/images/hero_sate_taichan_1794494904829.jpg"
                      alt="Sate Taichan Rotterdam Special"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent flex flex-col justify-end p-5">
                      <span className="text-[11px] font-bold text-[#F39223] uppercase tracking-widest">
                        100% Ayam Segar Pilihan
                      </span>
                      <h3 className="text-white font-extrabold text-lg sm:text-xl">
                        Daging Juicy • Sambal Pedas Ulek
                      </h3>
                      <p className="text-neutral-300 text-xs mt-1">
                        Dibakar fresh di atas arang batok kelapa saat Anda memesan.
                      </p>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border border-[#E8E2D8] dark:border-neutral-700 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#ED1C24] fill-[#ED1C24]" />
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">#1 Taichan Makassar</span>
                  </div>
                </div>
              )}

              {/* Sub-card badge */}
              <div className="mt-3 flex items-center justify-between px-4 py-2.5 bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 rounded-2xl text-xs text-[#555048] dark:text-neutral-300 shadow-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F39223]" />
                  <span>Dine-In & Takeaway Tersedia</span>
                </span>
                <span className="font-bold text-[#F39223]">Harga Mulai Rp 25.000</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Street Food Live Animated Marquee Ticker */}
      <div className="w-full bg-[#FAF0E4] dark:bg-[#1A1816] border-t border-[#E8E2D8] dark:border-neutral-800 py-2.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex items-center gap-8 animate-marquee text-xs font-bold text-[#555048] dark:text-neutral-300">
          <span className="flex items-center gap-1.5 text-[#F39223]">
            <Flame className="w-3.5 h-3.5 fill-[#F39223]" /> #PedasnyaBikinNagih
          </span>
          <span>•</span>
          <span>Sate Taichan Goreng & Bakar 100% Ayam Segar</span>
          <span>•</span>
          <span className="text-[#ED1C24]">Sambal Rawit Ulek Asli Pedas Segar</span>
          <span>•</span>
          <span>Arang Batok Kelapa Tradisional</span>
          <span>•</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">100% Halal Certified Indonesia</span>
          <span>•</span>
          <span>Samping Taman Benteng Fort Rotterdam Makassar</span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-[#F39223]">
            <Flame className="w-3.5 h-3.5 fill-[#F39223]" /> #PedasnyaBikinNagih
          </span>
          <span>•</span>
          <span>Sate Kulit Bakar & Goreng Crispy</span>
          <span>•</span>
          <span>Nasi Jeruk Komplit Porsi Kenyang</span>
        </div>
      </div>

    </section>
  );
};
