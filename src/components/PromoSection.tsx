import React from 'react';
import { ArrowRight, Tag, Flame } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const PromoSection: React.FC = () => {
  const { businessSettings, setIsCartOpen } = useCart();

  if (!businessSettings.promoActive) return null;

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-gradient-to-r from-[#FFF5EB] via-[#FFF8F2] to-[#FFF0E6] dark:from-[#1C1612] dark:via-[#181512] dark:to-[#1E1410] border-y border-[#F0D5C0] dark:border-neutral-800 py-7 relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Promo Text Info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ED1C24]/10 border border-[#ED1C24]/30 rounded-full text-xs font-bold text-[#ED1C24]">
              <Tag className="w-3.5 h-3.5" />
              <span>{businessSettings.promoDiscountText}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-[#1A1A1A] dark:text-white flex items-center justify-center md:justify-start gap-2">
              <Flame className="w-5 h-5 text-[#F39223] fill-[#F39223]" />
              <span>{businessSettings.promoTitle}</span>
            </h3>
            <p className="text-[#555048] dark:text-neutral-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {businessSettings.promoDescription}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={scrollToMenu}
              className="px-5 py-2.5 bg-[#F39223] hover:bg-[#de8016] text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Pesan Menu Promo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-4 py-2.5 bg-white dark:bg-neutral-800 hover:bg-[#F5F2EB] dark:hover:bg-neutral-700 text-[#1A1A1A] dark:text-white font-semibold text-xs sm:text-sm rounded-xl border border-[#E8E2D8] dark:border-neutral-700 transition-colors cursor-pointer shadow-xs"
            >
              Buka Keranjang
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
