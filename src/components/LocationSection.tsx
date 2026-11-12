import React from 'react';
import { MapPin, Clock, Navigation, Instagram, Phone, Share2, ExternalLink } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const LocationSection: React.FC = () => {
  const { businessSettings } = useCart();

  return (
    <section id="location" className="py-16 lg:py-24 bg-[#F5F1E9] dark:bg-[#141416] text-[#1A1A1A] dark:text-[#F5F5F7] border-t border-[#E8E2D8] dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-[#F39223]/50 dark:border-[#F39223]/40 text-[#F39223] font-bold text-xs uppercase tracking-widest mb-3 shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Kunjungi Kedai Kami</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
            Lokasi & Jam Operasional
          </h2>
          <p className="text-[#555048] dark:text-neutral-300 text-sm sm:text-base mt-2">
            Nikmati suasana nongkrong malam khas Makassar di samping kemegahan Taman Benteng Rotterdam.
          </p>
        </div>

        {/* Content Split: Details Card & Google Maps Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Info Card (4 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white dark:bg-[#1B1B1F] border border-[#E8E2D8] dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
            
            <div className="space-y-6">
              {/* Address Block */}
              <div>
                <span className="text-xs font-bold text-[#F39223] uppercase tracking-widest block mb-2">
                  Alamat Lengkap
                </span>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF0F0] dark:bg-rose-950/40 border border-[#ED1C24]/30 dark:border-[#ED1C24]/20 text-[#ED1C24] shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#1A1A1A] dark:text-white">
                      Sate Taichan Rotterdam
                    </h3>
                    <p className="text-xs sm:text-sm text-[#555048] dark:text-neutral-300 mt-1 leading-relaxed">
                      {businessSettings.address}
                    </p>
                    <p className="text-xs text-[#F39223] font-semibold mt-1">
                      Patokan: Tepat di samping area taman Benteng Rotterdam.
                    </p>
                  </div>
                </div>
              </div>

              {/* Operating Hours Block */}
              <div className="pt-4 border-t border-[#E8E2D8] dark:border-neutral-800">
                <span className="text-xs font-bold text-[#F39223] uppercase tracking-widest block mb-2">
                  Jam Buka (WITA)
                </span>
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-[#FFF5EB] dark:bg-amber-950/40 border border-[#F39223]/30 dark:border-[#F39223]/20 text-[#F39223] shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex-1 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-[#E8E2D8] dark:border-neutral-800">
                      <span className="text-[#6B665E] dark:text-neutral-400">Senin – Sabtu:</span>
                      <span className="font-bold text-[#1A1A1A] dark:text-white">17.00 – 23.30 WITA</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-[#E8E2D8] dark:border-neutral-800">
                      <span className="text-[#6B665E] dark:text-neutral-400">Malam Minggu:</span>
                      <span className="font-bold text-[#ED1C24]">17.00 – 24.00 WITA</span>
                    </div>
                    <p className="text-[11px] text-[#8C867C] dark:text-neutral-400 pt-0.5">
                      *Menerima makan di tempat (Dine-In) & pesanan bungkus (Takeaway).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social & Direction Actions */}
            <div className="pt-6 border-t border-[#E8E2D8] dark:border-neutral-800 space-y-3">
              <a
                href="https://maps.google.com/?q=Benteng+Rotterdam+Makassar"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F39223] to-[#ED1C24] hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4 fill-white" />
                <span>Buka Petunjuk Arah Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://instagram.com/satetaichan.rotterdam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#F5F2EB] dark:bg-neutral-800/80 hover:bg-[#EAE5DC] dark:hover:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs font-semibold text-[#1A1A1A] dark:text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Instagram className="w-4 h-4 text-pink-600" />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://tiktok.com/@satetaichanrotterdam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#F5F2EB] dark:bg-neutral-800/80 hover:bg-[#EAE5DC] dark:hover:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-xs font-semibold text-[#1A1A1A] dark:text-neutral-200 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-[#F39223]" />
                  <span>TikTok</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right: Embedded Google Maps (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md min-h-[380px] lg:min-h-full relative">
            <iframe
              title="Peta Lokasi Sate Taichan Rotterdam Makassar"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3973.805544719273!2d119.40428577585507!3d-5.135081194842183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbf02ae55555555%3A0x6b7593c66f6dfeb7!2sFort%20Rotterdam%20Makassar!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full object-cover filter contrast-[1.02]"
            />
            
            {/* Map overlay badge */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-[#E8E2D8] dark:border-neutral-800 rounded-2xl p-3 shadow-md flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#ED1C24] animate-ping" />
              <div className="text-xs">
                <p className="font-bold text-[#1A1A1A] dark:text-white">Sate Taichan Rotterdam</p>
                <p className="text-[#6B665E] dark:text-neutral-400 text-[11px]">Samping Taman Benteng Rotterdam</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
