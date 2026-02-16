'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import ContactDrawer from './ContactDrawer';

export default function FloatingContactButton() {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const { itemCount, openCartDrawer } = useCart();

  return (
    <>
      {/* Floating Buttons - 10px rechts neben dem Content-Container (max-width: 1400px) */}
      <div
        className="fixed top-[calc(200px+10vh)] z-[60] flex flex-col gap-3"
        style={{
          right: 'max(0.5rem, calc((100vw - 1400px) / 2 - 20px - 3.5rem))',
        }}
      >
        {/* Kontakt Button */}
        <button
          onClick={() => setIsContactDrawerOpen(true)}
          className="w-14 h-14 bg-[#ed1b24] rounded-full hover:scale-110 transition-transform shadow-lg flex items-center justify-center"
          aria-label="Kontakt öffnen"
        >
          <Image
            src="/images/Icons/Kontakt weiß.png"
            alt="Kontakt"
            width={28}
            height={28}
            className="w-7 h-7"
          />
        </button>

        {/* Warenkorb Button */}
        <button
          onClick={openCartDrawer}
          className="relative w-14 h-14 bg-white rounded-full hover:scale-110 transition-transform shadow-lg flex items-center justify-center"
          aria-label="Warenkorb öffnen"
        >
          <Image
            src="/images/Icons/Warenkorb schieferschwarz.png"
            alt="Warenkorb"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#ed1b24] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
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
