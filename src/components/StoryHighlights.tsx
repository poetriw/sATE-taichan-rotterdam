import React, { useState } from 'react';
import { Users, ShoppingBag, Utensils, Calendar, Gift, Flame, X, CheckCircle2 } from 'lucide-react';

interface HighlightItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  subtitle: string;
  description: string;
  tags: string[];
}

export const StoryHighlights: React.FC = () => {
  const [activeStory, setActiveStory] = useState<HighlightItem | null>(null);

  const highlights: HighlightItem[] = [
    {
      id: 'taichaners',
      title: 'Taichaners',
      icon: <Users className="w-5 h-5 text-[#F39223]" />,
      subtitle: 'Komunitas Pecinta Pedas Makassar',
      description: 'Sebutan hangat bagi seluruh pelanggan setia dan sahabat Sate Taichan Rotterdam. Terima kasih telah menjadikan kami tempat nongkrong malam favorit di kawasan Benteng Rotterdam!',
      tags: ['#TaichanersMakassar', '#SahabatRotterdam', '#PedasBikinNagih'],
    },
    {
      id: 'pesan',
      title: 'Pesan',
      icon: <ShoppingBag className="w-5 h-5 text-[#F39223]" />,
      subtitle: 'Cara Order Mudah & Cepat',
      description: 'Pesan langsung melalui website ini! Pilih menu taichan favorit, atur tingkat pedas dan catatan, lalu tekan Checkout untuk mengirim pesanan terformat langsung ke WhatsApp kasir resmi kami.',
      tags: ['Dine-In Siap Saji', 'Takeaway Rapi & Hangat', 'Respon Cepat'],
    },
    {
      id: 'squad',
      title: 'Squad',
      icon: <Utensils className="w-5 h-5 text-[#F39223]" />,
      subtitle: 'Tim Dapur & Grill Master',
      description: 'Dibalik setiap tusuk sate yang empuk dan sambal yang pedas nampol, ada tim grill master kami yang memanggang daging segar setiap sore dengan standar kebersihan tinggi dan sertifikasi 100% Halal.',
      tags: ['Grill Master Arang', 'Bumbu Gurih Rahasia', 'Higienis & Halal'],
    },
    {
      id: 'event',
      title: 'Event',
      icon: <Calendar className="w-5 h-5 text-[#F39223]" />,
      subtitle: 'Catering, Nobar & Kumpul Komunitas',
      description: 'Menerima pesanan partai besar untuk gathering kantor, pesta ulang tahun, arisan, maupun event komunitas di Makassar. Hubungi WhatsApp kami untuk reservasi dan paket spesial.',
      tags: ['Catering Kantor', 'Pesta & Arisan', 'Malam Minggu Nobar'],
    },
    {
      id: 'giveaway',
      title: 'Giveaway',
      icon: <Gift className="w-5 h-5 text-[#F39223]" />,
      subtitle: 'Promo & Penawaran Spesial',
      description: 'Ikuti Instagram resmi kami @satetaichan.rotterdam dan TikTok @satetaichanrotterdam untuk info promo mingguan, kupon gratis porsi sate, dan hadiah menarik untuk para Taichaners!',
      tags: ['@satetaichan.rotterdam', 'Free Extra Sambal', 'Promo Bundling'],
    },
    {
      id: 'menu',
      title: 'Menu',
      icon: <Flame className="w-5 h-5 text-[#ED1C24]" />,
      subtitle: 'Menu Signature & Rekomendasi',
      description: 'Mulai dari Taichan Daging Dada lembut rendah lemak, Daging Paha juicy, Kulit Crispy gurih renyah, hingga Paket Hemat lengkap dengan lontong dan kuah kaldu ayam gurih.',
      tags: ['Best Seller Daging Paha', 'Kulit Crispy', 'Paket Hemat Lontong'],
    },
  ];

  return (
    <section className="bg-[#F5F1E9] dark:bg-[#151518] py-5 border-b border-[#E8E2D8] dark:border-neutral-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#F39223] uppercase tracking-wider">Sorotan Instagram</span>
            <span className="text-neutral-400 text-xs">·</span>
            <span className="text-xs text-[#555048] dark:text-neutral-300">@satetaichan.rotterdam</span>
          </div>
          <span className="text-[11px] text-[#6B665E] dark:text-neutral-400 hidden sm:inline">
            Klik untuk melihat cerita & panduan
          </span>
        </div>

        {/* Highlights Row */}
        <div className="flex items-center gap-5 sm:gap-7 overflow-x-auto pb-1 no-scrollbar">
          {highlights.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveStory(item)}
              className="flex flex-col items-center gap-2 group shrink-0 focus:outline-none cursor-pointer"
            >
              {/* Outer story ring with brand colors */}
              <div className="w-16 h-16 sm:w-17 sm:h-17 rounded-full p-[2px] bg-gradient-to-tr from-[#F39223] to-[#ED1C24] group-hover:scale-105 transition-transform shadow-xs">
                <div className="w-full h-full rounded-full bg-white dark:bg-neutral-900 border-2 border-white dark:border-neutral-900 flex items-center justify-center group-hover:bg-[#FAF7F2] dark:group-hover:bg-neutral-800 transition-colors">
                  {item.icon}
                </div>
              </div>
              <span className="text-xs font-bold text-[#1A1A1A] dark:text-neutral-200 group-hover:text-[#F39223] transition-colors whitespace-nowrap">
                {item.title}
              </span>
            </button>
          ))}
        </div>

      </div>

      {/* Story Detail Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1A1A1E] border border-[#E8E2D8] dark:border-neutral-700 rounded-2xl p-6 shadow-2xl text-[#1A1A1A] dark:text-white">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8E2D8] dark:border-neutral-700 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F39223] to-[#ED1C24] p-[2px]">
                  <div className="w-full h-full rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center">
                    {activeStory.icon}
                  </div>
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#1A1A1A] dark:text-white">{activeStory.title}</h4>
                  <p className="text-[11px] text-[#F39223] font-semibold">{activeStory.subtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveStory(null)}
                aria-label="Tutup sorotan"
                className="p-1.5 text-neutral-400 hover:text-[#1A1A1A] dark:hover:text-white bg-[#F5F2EB] dark:bg-neutral-800 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-5 space-y-4">
              <p className="text-sm text-[#4A4640] dark:text-neutral-300 leading-relaxed">
                {activeStory.description}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {activeStory.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF7F2] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 rounded-lg text-xs font-medium text-[#4A4640] dark:text-neutral-300"
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#F39223]" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Action Footer */}
            <div className="border-t border-[#E8E2D8] dark:border-neutral-700 pt-4 flex gap-3">
              <a
                href="https://instagram.com/satetaichan.rotterdam"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#F39223] hover:bg-[#de8016] text-white text-xs font-bold text-center transition-all shadow-xs"
              >
                Buka Instagram
              </a>
              <button
                onClick={() => setActiveStory(null)}
                className="py-2.5 px-4 rounded-xl bg-[#F5F2EB] dark:bg-neutral-800 hover:bg-[#EAE5DC] dark:hover:bg-neutral-700 text-xs font-semibold text-[#1A1A1A] dark:text-neutral-200 cursor-pointer border border-[#E8E2D8] dark:border-neutral-700"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
