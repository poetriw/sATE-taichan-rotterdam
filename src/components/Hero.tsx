import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  ArrowDownRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { getMakassarOperatingStatus, formatRupiah } from '../utils/orderLogic';
import { useCart } from '../context/CartContext';
import { ThreeTaichanCanvas } from './ThreeTaichanCanvas';
import { Product, SpicyLevel } from '../types';

const CUTOUT_NAMES = [
  'sate_taichan_bakar',
  'sate_kulit_bakar',
  'sate_bakso_bakar',
  'sate_bakso_goreng',
  'nasi_jeruk_komplit',
  'lontong',
  'mineral_water',
];

const isCutoutImage = (imagePath: string) =>
  CUTOUT_NAMES.some((name) => imagePath.includes(name));

export const Hero: React.FC = () => {
  const [operatingStatus, setOperatingStatus] = useState(() => getMakassarOperatingStatus());
  const { products, setIsCartOpen, setSelectedProductForDetail } = useCart();

  // Strictly 2 sambal options: Kacang or Pedas
  const [selectedSambal, setSelectedSambal] = useState<SpicyLevel>('Pedas');

  // Top 3 signature menu carousel index & pause state
  const [activeTopIndex, setActiveTopIndex] = useState(1);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setOperatingStatus(getMakassarOperatingStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Select 3 top signature items
  const topThreeMenus = useMemo<Product[]>(() => {
    const preferredIds = ['str-01', 'str-02', 'str-08'];
    const picked = preferredIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (picked.length === 3) return picked;

    const bestSellers = products.filter((p) => p.isBestSeller && p.isAvailable);
    if (bestSellers.length >= 3) return bestSellers.slice(0, 3);
    return products.slice(0, 3);
  }, [products]);

  // Gently cycle the 3 top menus unless user is interacting
  useEffect(() => {
    if (topThreeMenus.length < 3 || isCarouselPaused) return;
    const timer = setInterval(() => {
      setActiveTopIndex((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, [topThreeMenus.length, isCarouselPaused]);

  const handleShift = (direction: -1 | 1) => {
    if (topThreeMenus.length === 0) return;
    setActiveTopIndex((prev) => (prev + direction + topThreeMenus.length) % topThreeMenus.length);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const sambalOptions: { id: SpicyLevel; title: string; subtitle: string; note: string }[] = [
    {
      id: 'Kacang',
      title: 'Sambal Kacang',
      subtitle: 'Gurih manis kacang sangrai',
      note: 'Kacang tanah sangrai dihaluskan hangat dengan bumbu gurih manis khas taichan.',
    },
    {
      id: 'Pedas',
      title: 'Sambal Pedas',
      subtitle: 'Rawit merah ulek segar',
      note: 'Cabai rawit merah segar diulek langsung, pedas nampol berpadu perasan jeruk nipis.',
    },
  ];

  const activeSambalInfo = sambalOptions.find((s) => s.id === selectedSambal) || sambalOptions[1];

  // Compute left, center, right slot items for the 3-card stage
  const leftIdx = topThreeMenus.length === 3 ? (activeTopIndex + 2) % 3 : 0;
  const centerIdx = topThreeMenus.length === 3 ? activeTopIndex : 0;
  const rightIdx = topThreeMenus.length === 3 ? (activeTopIndex + 1) % 3 : 0;

  const slots =
    topThreeMenus.length === 3
      ? [
          { slot: 'left' as const, index: leftIdx, product: topThreeMenus[leftIdx] },
          { slot: 'center' as const, index: centerIdx, product: topThreeMenus[centerIdx] },
          { slot: 'right' as const, index: rightIdx, product: topThreeMenus[rightIdx] },
        ]
      : topThreeMenus.map((product, index) => ({
          slot: 'center' as const,
          index,
          product,
        }));

  return (
    <section
      id="hero"
      className="relative bg-[#FAF7F2] dark:bg-[#121214] pt-8 sm:pt-12 pb-10 border-b border-[#E8E2D8] dark:border-neutral-800 transition-colors duration-300 overflow-hidden"
    >
      {/* Subtle architectural background glow matching brand orange/red palette */}
      <div className="absolute -top-24 left-1/4 w-[28rem] h-[28rem] bg-[#F39223]/8 dark:bg-[#F39223]/12 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-14 sm:space-y-16">
        {/* BAND 1: Top Asymmetric Editorial Split (matching reference top area) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Brand Headline, Concise Copy, 2-Sambal Choice & CTAs */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Simple, natural status line */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs font-medium text-[#555048] dark:text-neutral-400">
              <span className="inline-flex items-center gap-2 font-semibold text-[#1A1A1A] dark:text-neutral-200">
                <span
                  className={`w-2 h-2 rounded-full ${
                    operatingStatus.isOpen ? 'bg-emerald-500' : 'bg-neutral-400'
                  }`}
                />
                <span>{operatingStatus.statusText}</span>
              </span>
              <span className="text-[#D8D0C5] dark:text-neutral-700 hidden sm:inline">•</span>
              <span>100% Halal Indonesia</span>
            </div>

            {/* Main Headline with reference-style directional accent */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-black text-[#1A1A1A] dark:text-white tracking-tight leading-[1.1] [text-wrap:balance]">
              Pedasnya{' '}
              <span className="text-[#F39223] inline-flex items-center gap-2">
                <span>Bikin Nagih</span>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#F39223] text-white align-middle"
                >
                  <ArrowDownRight className="w-5 h-5" />
                </span>
              </span>
              <br />
              Rasanya Bikin Balik Lagi
            </h1>

            {/* Editorial description */}
            <p className="text-[#555048] dark:text-neutral-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Sate taichan daging ayam pilihan dibakar segar di atas arang batok kelapa dengan bumbu gurih meresap dan racikan sambal khas di samping Taman Benteng Rotterdam, Makassar.
            </p>

            {/* 2 Sambal Options Only: Kacang & Pedas */}
            <div className="max-w-lg mx-auto lg:mx-0 pt-1">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-[#1A1A1A] dark:text-white">
                  Pilihan Sambal Favorit
                </span>
                <span className="text-[11px] font-semibold text-[#F39223]">
                  2 Varian Sambal
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {sambalOptions.map((item) => {
                  const isActive = selectedSambal === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSambal(item.id)}
                      className={`py-2.5 px-3.5 rounded-xl text-left transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[#F39223] border-[#F39223] text-white shadow-xs'
                          : 'bg-white dark:bg-[#18181B] border-[#E8E2D8] dark:border-neutral-800 text-[#1A1A1A] dark:text-neutral-200 hover:border-[#F39223]'
                      }`}
                    >
                      <span className="block text-xs sm:text-sm font-bold">
                        {item.title}
                      </span>
                      <span
                        className={`block text-[11px] mt-0.5 ${
                          isActive ? 'text-white/90' : 'text-[#6B665E] dark:text-neutral-400'
                        }`}
                      >
                        {item.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-[#6B665E] dark:text-neutral-400 mt-2">
                {activeSambalInfo.note}
              </p>
            </div>

            {/* Compact Address & Operating Hours */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs text-[#555048] dark:text-neutral-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#F39223] shrink-0" />
                <span>Jl. WR Supratman (Samping Benteng Rotterdam)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#ED1C24] shrink-0" />
                <span>Senin–Sabtu 17.00–23.30 | Malam Minggu s/d 24.00</span>
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToSection('menu')}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#F39223] hover:bg-[#de8016] text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Lihat Katalog Menu</span>
                <span className="w-5 h-5 rounded-full bg-white text-[#F39223] inline-flex items-center justify-center">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-white dark:bg-[#18181B] hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-[#1A1A1A] dark:text-white font-semibold text-xs sm:text-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#F39223]" />
                <span>Pesan via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right: Asymmetric Sculpted Photo Frame matching reference top-right silhouette */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Soft tilted accent backing plate in brand warm orange */}
              <div
                aria-hidden="true"
                className="absolute inset-x-3 -inset-y-2.5 rounded-[2rem] bg-[#F39223]/18 dark:bg-[#F39223]/20 border border-[#F39223]/25 pointer-events-none"
              />
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-2xl rounded-bl-2xl border border-[#E8E2D8] dark:border-neutral-700 bg-[#18181B] shadow-lg">
                <img
                  src="/assets/images/hero_sate_taichan_1794494904829.jpg"
                  alt="Sate Taichan Rotterdam dibakar arang dengan sambal pedas dan kacang"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BAND 2: Interactive 3 Top Menu Showcase (3 top menu yang bergantian bergeser) */}
        <div
          className="pt-4 border-t border-[#E8E2D8]/80 dark:border-neutral-800/80"
          onMouseEnter={() => setIsCarouselPaused(true)}
          onMouseLeave={() => setIsCarouselPaused(false)}
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F39223]">
                Menu Andalan
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] dark:text-white tracking-tight mt-0.5">
                3 Top Menu Favorit Taichaners
              </h2>
            </div>

            {/* Slide Controls */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleShift(-1)}
                aria-label="Geser top menu ke kiri"
                className="p-2 rounded-full bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 text-[#1A1A1A] dark:text-white hover:border-[#F39223] hover:text-[#F39223] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleShift(1)}
                aria-label="Geser top menu ke kanan"
                className="p-2 rounded-full bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 text-[#1A1A1A] dark:text-white hover:border-[#F39223] hover:text-[#F39223] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3-Card Stage (Left flanking - Center Spotlight - Right flanking) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center">
            {slots.map(({ slot, index, product }) => {
              const isCenter = slot === 'center';
              const isCutout = isCutoutImage(product.image);

              return (
                <div
                  key={`${slot}-${product.id}`}
                  onClick={() => {
                    if (isCenter) {
                      setSelectedProductForDetail(product);
                    } else {
                      setActiveTopIndex(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (isCenter) {
                        setSelectedProductForDetail(product);
                      } else {
                        setActiveTopIndex(index);
                      }
                    }
                  }}
                  aria-label={
                    isCenter
                      ? `Lihat detail ${product.name}`
                      : `Geser ${product.name} ke tengah`
                  }
                  className={`cursor-pointer transition-all duration-500 rounded-3xl border overflow-hidden ${
                    isCenter
                      ? 'md:col-span-6 bg-white dark:bg-[#18181B] border-[#F39223]/60 shadow-xl scale-100 z-10'
                      : 'hidden md:block md:col-span-3 bg-white/75 dark:bg-[#18181B]/70 border-[#E8E2D8] dark:border-neutral-800 opacity-70 hover:opacity-95 scale-[0.94]'
                  }`}
                >
                  {/* Image container */}
                  <div
                    className={`relative w-full overflow-hidden flex items-center justify-center ${
                      isCenter ? 'aspect-[16/10]' : 'aspect-[4/3]'
                    } ${
                      isCutout
                        ? 'bg-white dark:bg-[#201D1A] p-3'
                        : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`w-full h-full transition-transform duration-500 ${
                        isCutout ? 'object-contain' : 'object-cover'
                      } ${isCenter ? 'hover:scale-105' : ''}`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/assets/images/hero_sate_taichan_1794494904829.jpg';
                      }}
                    />

                    {/* Subtle rank tag only on center spotlight */}
                    {isCenter && (
                      <div className="absolute top-3 left-3 bg-[#1A1A1A]/85 dark:bg-black/75 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                        Top #{index + 1} Favorit
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className={isCenter ? 'p-5' : 'p-4'}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`font-extrabold text-[#1A1A1A] dark:text-white leading-snug ${
                            isCenter ? 'text-base sm:text-lg' : 'text-sm line-clamp-1'
                          }`}
                        >
                          {product.name}
                        </h3>
                        {product.portionDetail && (
                          <p className="text-xs text-[#6B665E] dark:text-neutral-400 mt-0.5 line-clamp-1">
                            {product.portionDetail}
                          </p>
                        )}
                      </div>
                      <span
                        className={`font-black text-[#F39223] whitespace-nowrap tabular-nums ${
                          isCenter ? 'text-base sm:text-lg' : 'text-sm'
                        }`}
                      >
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    {isCenter && (
                      <div className="mt-4 pt-3 border-t border-[#E8E2D8] dark:border-neutral-800 flex items-center justify-between gap-3">
                        <span className="text-xs text-[#555048] dark:text-neutral-400">
                          Tersedia Sambal Kacang &amp; Pedas
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F39223]">
                          <span>Pesan Menu</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Slide Dots + "Lihat Semua Menu" Pill CTA (matching reference "View All" + down arrow) */}
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Pilih top menu">
              {topThreeMenus.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTopIndex === idx}
                  aria-label={`Tampilkan ${item.name}`}
                  onClick={() => setActiveTopIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeTopIndex === idx
                      ? 'w-7 bg-[#F39223]'
                      : 'w-2 bg-[#D8D0C5] dark:bg-neutral-700 hover:bg-[#F39223]/60'
                  }`}
                />
              ))}
            </div>

            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToSection('menu')}
                className="px-7 py-2.5 rounded-full bg-white dark:bg-[#18181B] hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs sm:text-sm font-bold text-[#1A1A1A] dark:text-white shadow-xs transition-all cursor-pointer"
              >
                Lihat Semua Menu
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('taichan-3d-stage')}
                aria-label="Gulir ke tampilan 3D Sate Taichan"
                className="w-7 h-7 rounded-full bg-white dark:bg-[#18181B] border border-[#E8E2D8] dark:border-neutral-700 text-[#555048] dark:text-neutral-300 hover:text-[#F39223] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BAND 3: Centered Frameless 3D Sate Taichan Showcase (tanpa ada frame pembatas) */}
        <div
          id="taichan-3d-stage"
          className="relative pt-4 pb-2 flex flex-col items-center text-center"
        >
          {/* Ambient radial glow and subtle concentric backdrop rings (no rectangular frame or border) */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-4 mx-auto w-[20rem] sm:w-[30rem] h-[16rem] bg-[#F39223]/14 dark:bg-[#F39223]/18 rounded-full blur-3xl pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-12 left-1/2 -translate-x-1/2 w-[22rem] sm:w-[34rem] h-[22rem] sm:h-[34rem] rounded-full border border-[#F39223]/15 dark:border-[#F39223]/15 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute top-20 left-1/2 -translate-x-1/2 w-[16rem] sm:w-[26rem] h-[16rem] sm:h-[26rem] rounded-full border border-[#E8E2D8]/80 dark:border-neutral-800/80 pointer-events-none"
          />

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#F39223]">
              Panggangan Arang Batok Kelapa
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#1A1A1A] dark:text-white mt-1">
              Sate Taichan Rotterdam dengan Dua Pilihan Sambal
            </h2>
          </div>

          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <ThreeTaichanCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};
