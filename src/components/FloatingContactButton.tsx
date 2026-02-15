'use client';

import { useState } from 'react';
import Image from 'next/image';
import ContactDrawer from './ContactDrawer';

export default function FloatingContactButton() {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  return (
    <>
      {/* Floating Contact Button - 10px rechts neben dem Content-Container (max-width: 1400px) */}
      <div
        className="fixed top-[calc(200px+10vh)] z-[60]"
        style={{
          right: 'max(0.5rem, calc((100vw - 1400px) / 2 - 10px - 3.5rem))',
        }}
      >
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
      </div>

      {/* Contact Drawer */}
      <ContactDrawer
        isOpen={isContactDrawerOpen}
        onClose={() => setIsContactDrawerOpen(false)}
      />
    </>
  );
}
