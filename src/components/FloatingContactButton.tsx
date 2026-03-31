'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import ContactDrawer from './ContactDrawer';

export default function FloatingContactButton() {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { itemCount, openCartDrawer, isCartDrawerOpen } = useCart();

  useEffect(() => { setMounted(true); }, []);

  return (
    <>
      {/* Floating Buttons - 10px rechts neben dem Content-Container (max-width: 1400px) */}
      <div
        className={`fixed bottom-6 right-6 z-[60] flex flex-col gap-3 transition-opacity duration-300 ${
          isCartDrawerOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Kontakt Button */}
        <button
          onClick={() => setIsContactDrawerOpen(true)}
          className="w-11 h-11 md:w-14 md:h-14 bg-brand rounded-full hover:scale-110 transition-transform shadow-lg flex items-center justify-center"
          aria-label="Kontakt öffnen"
        >
          <Image
            src="/images/Icons/Kontakt weiß.png"
            alt="Kontakt"
            width={28}
            height={28}
            className="w-[22px] h-[22px] md:w-7 md:h-7"
          />
        </button>

        {/* Warenkorb Button */}
        <button
          onClick={openCartDrawer}
          className="relative w-11 h-11 md:w-14 md:h-14 bg-white rounded-full hover:scale-110 transition-transform shadow-lg flex items-center justify-center"
          aria-label="Warenkorb öffnen"
        >
          <Image
            src="/images/Icons/Warenkorb schieferschwarz.png"
            alt="Warenkorb"
            width={28}
            height={28}
            className="w-[22px] h-[22px] md:w-7 md:h-7"
          />
          {mounted && itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {itemCount}
            </span>
          )}
        </button>
      </div>

      {/* Contact Drawer */}
      <ContactDrawer
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
      />
    </>
  );
}
