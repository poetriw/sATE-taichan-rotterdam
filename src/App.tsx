import React from 'react';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { StoryHighlights } from './components/StoryHighlights';
import { PromoSection } from './components/PromoSection';
import { MenuCatalog } from './components/MenuCatalog';
import { AboutSection } from './components/AboutSection';
import { GallerySection } from './components/GallerySection';
import { LocationSection } from './components/LocationSection';
import { CartDrawer } from './components/CartDrawer';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#121214] text-[#1A1A1A] dark:text-[#F5F5F7] selection:bg-[#F39223] selection:text-white flex flex-col font-sans transition-colors duration-300">
          <Navbar />
          
          <main className="flex-1">
            <Hero />
            <StoryHighlights />
            <PromoSection />
            <MenuCatalog />
            <AboutSection />
            <GallerySection />
            <LocationSection />
          </main>

          <CartDrawer />
          <AdminModal />
          <Footer />
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
