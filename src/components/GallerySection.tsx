import React, { useState } from 'react';
import { Camera, X, Instagram, Eye, Flame } from 'lucide-react';

interface GalleryItem {
  id: string;
  image: string;
  caption: string;
  tag: string;
}

export const GallerySection: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      image: '/src/assets/images/hero_sate_taichan_1794494904829.jpg',
      caption: 'Sate Taichan Daging bakar gurih dengan sambal ulek rawit merah segar dan potongan jeruk nipis.',
      tag: 'Signature Menu',
    },
    {
      id: 'g2',
      image: '/src/assets/images/product_taichan_kulit_1794494905622.jpg',
      caption: 'Sate Kulit Taichan Crispy digoreng dan dipanggang hingga kecokelatan renyah.',
      tag: 'Crispy Favorite',
    },
    {
      id: 'g3',
      image: '/src/assets/images/gallery_streetfood_rotterdam_1794494907100.jpg',
      caption: 'Suasana santap malam santai di Jl. WR Supratman tepat di samping Benteng Rotterdam Makassar.',
      tag: 'Makassar Night Vibe',
    },
    {
      id: 'g4',
      image: '/src/assets/images/product_paket_hemat_1794494906504.jpg',
      caption: 'Paket Hemat lengkap dengan lontong pulen daun pisang dan kuah kaldu ayam gurih.',
      tag: 'Porsi Kenyang',
    },
    {
      id: 'g5',
      image: '/src/assets/images/product_taichan_daging_1794494905535.jpg',
      caption: 'Daging ayam segar pilihan dipotong pas untuk menjaga keempukan dan sari daging saat dipanggang.',
      tag: 'Fresh Ingredients',
    },
    {
      id: 'g6',
      image: '/src/assets/images/hero_sate_taichan_1794494904829.jpg',
      caption: 'Aroma arang batok kelapa dan bumbu gurih yang membuat siapapun ketagihan.',
      tag: '#PedasnyaBikinNagih',
    },
  ];

  return (
    <section id="gallery" className="py-16 lg:py-24 bg-[#FAF7F2] dark:bg-[#121214] text-[#1A1A1A] dark:text-[#F5F5F7] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-neutral-900 border border-[#ED1C24]/30 dark:border-[#ED1C24]/40 text-[#ED1C24] font-bold text-xs uppercase tracking-widest mb-3 shadow-xs">
              <Camera className="w-3.5 h-3.5" />
              <span>Dokumentasi & Galeri Rasa</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1A1A1A] dark:text-white tracking-tight">
              Galeri Sate Taichan Rotterdam
            </h2>
            <p className="text-[#555048] dark:text-neutral-300 text-sm sm:text-base mt-2 max-w-xl">
              Lihat momen kebersamaan pelanggan, proses pemanggangan arang tradisional, dan kelezatan sate taichan kami.
            </p>
          </div>

          <a
            href="https://instagram.com/satetaichan.rotterdam"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 hover:bg-[#F5F2EB] dark:hover:bg-neutral-800 border border-[#E8E2D8] dark:border-neutral-800 text-xs font-bold text-[#1A1A1A] dark:text-neutral-200 transition-colors shadow-xs"
          >
            <Instagram className="w-4 h-4 text-[#F39223]" />
            <span>Kunjungi @satetaichan.rotterdam</span>
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-[#E8E2D8] dark:border-neutral-800 group cursor-pointer shadow-sm hover:border-[#F39223] dark:hover:border-[#F39223] transition-all duration-300 hover:shadow-md"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5">
                <span className="text-[11px] font-bold text-[#F39223] uppercase tracking-wider mb-1">
                  {item.tag}
                </span>
                <p className="text-xs text-white line-clamp-2 leading-relaxed">
                  {item.caption}
                </p>
              </div>

              {/* View Icon */}
              <div className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setSelectedPhoto(null)} />
          
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1A1A1D] border border-[#E8E2D8] dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl z-10 text-[#1A1A1A] dark:text-[#F5F5F7]">
            <button
              onClick={() => setSelectedPhoto(null)}
              aria-label="Tutup galeri foto"
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 dark:bg-neutral-800/90 hover:bg-white dark:hover:bg-neutral-700 text-[#1A1A1A] dark:text-white rounded-full transition-colors cursor-pointer border border-[#E8E2D8] dark:border-neutral-700 shadow-md"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-[16/10] bg-black">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.caption}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="p-5 bg-[#FAF7F2] dark:bg-[#151518] border-t border-[#E8E2D8] dark:border-neutral-800">
              <span className="text-xs font-bold text-[#F39223] uppercase tracking-wider">
                {selectedPhoto.tag}
              </span>
              <p className="text-sm text-[#4A4640] dark:text-neutral-300 mt-1 leading-relaxed">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
