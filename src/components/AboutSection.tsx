import React from 'react';
import { ShieldCheck, Flame, Heart, Award, MapPin } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 lg:py-24 bg-[#F5F1E9] dark:bg-[#141416] border-y border-[#E8E2D8] dark:border-neutral-800 text-[#1A1A1A] dark:text-[#F5F5F7] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Brand Storytelling */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-[#F39223]/50 dark:border-[#F39223]/40 text-[#F39223] font-bold text-xs uppercase tracking-widest shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-[#F39223]" />
              <span>Tentang Sate Taichan Rotterdam</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] dark:text-white tracking-tight leading-tight [text-wrap:balance]">
              Menghadirkan Cita Rasa Pedas Juara di Samping Benteng Bersejarah Makassar
            </h2>

            <p className="text-[#555048] dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
              Bermula dari kecintaan mendalam terhadap kuliner street food Nusantara yang berani bumbu, <strong className="text-[#1A1A1A] dark:text-white">Sate Taichan Rotterdam</strong> hadir sebagai destinasi nongkrong dan santap malam favorit warga Makassar dan wisatawan.
            </p>

            <p className="text-[#555048] dark:text-neutral-300 text-sm sm:text-base leading-relaxed">
              Nama Rotterdam kami sematkan dengan bangga karena kedai kami bertempat persis di samping salah satu ikon sejarah paling megah di Sulawesi Selatan, yaitu <strong className="text-[#1A1A1A] dark:text-white">Taman Benteng Fort Rotterdam</strong>. Setiap tusuk sate dibakar fresh menggunakan arang batok kelapa pilihan, menghasilkan aroma smoky yang khas berpadu gurihnya daging ayam empuk juicy dan sengatan sambal rawit merah ulek segar.
            </p>

            {/* Quality Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1B1F] border border-[#E8E2D8] dark:border-neutral-800 flex items-start gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-white">100% Halal Indonesia</h4>
                  <p className="text-xs text-[#6B665E] dark:text-neutral-400 mt-1 leading-relaxed">
                    Semua bahan baku, daging ayam, bumbu hingga proses pemanggangan terjamin halal dan higienis.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1B1F] border border-[#E8E2D8] dark:border-neutral-800 flex items-start gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-[#FFF5EB] dark:bg-amber-950/40 border border-[#F39223]/30 dark:border-[#F39223]/20 text-[#F39223] shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-white">Daging Segar Setiap Hari</h4>
                  <p className="text-xs text-[#6B665E] dark:text-neutral-400 mt-1 leading-relaxed">
                    Kami menggunakan potongan ayam segar tanpa pengawet yang dibumbui marinasi gurih meresap ke dalam serat.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1B1F] border border-[#E8E2D8] dark:border-neutral-800 flex items-start gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-[#FFF0F0] dark:bg-rose-950/40 border border-[#ED1C24]/30 dark:border-[#ED1C24]/20 text-[#ED1C24] shrink-0">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-white">Sambal Ulek Asli</h4>
                  <p className="text-xs text-[#6B665E] dark:text-neutral-400 mt-1 leading-relaxed">
                    Rawit merah pilihan diulek segar setiap hari dengan perasan jeruk nipis asli untuk kepuasan #PedasnyaBikinNagih.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#1B1B1F] border border-[#E8E2D8] dark:border-neutral-800 flex items-start gap-3.5 shadow-xs">
                <div className="p-2.5 rounded-xl bg-[#F5F2EB] dark:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-700 text-[#1A1A1A] dark:text-white shrink-0">
                  <MapPin className="w-5 h-5 text-[#F39223]" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#1A1A1A] dark:text-white">Suasana Khas Malam Makassar</h4>
                  <p className="text-xs text-[#6B665E] dark:text-neutral-400 mt-1 leading-relaxed">
                    Lokasi strategis di Jl. WR Supratman, angin sepoi malam khas pesisir pantai Makassar yang syahdu.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right: Authentic Street Food Visual Grid */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-[#E8E2D8] dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-md">
              <img
                src="/src/assets/images/gallery_streetfood_rotterdam_1794494907100.jpg"
                alt="Suasana Kuliner Sate Taichan Rotterdam Makassar"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
                <span className="text-[11px] font-bold text-[#F39223] uppercase tracking-widest">
                  Street Food Culture
                </span>
                <p className="text-white font-extrabold text-base">
                  Kumpul Asik & Santap Malam di Tepi Benteng Rotterdam
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D8] dark:border-neutral-800 bg-white dark:bg-neutral-900 h-40 shadow-xs">
                <img
                  src="/src/assets/images/product_taichan_kulit_1794494905622.jpg"
                  alt="Sate Kulit Taichan Crispy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-[#E8E2D8] dark:border-neutral-800 bg-white dark:bg-neutral-900 h-40 shadow-xs">
                <img
                  src="/src/assets/images/product_paket_hemat_1794494906504.jpg"
                  alt="Paket Hemat Sate Taichan Rotterdam"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
