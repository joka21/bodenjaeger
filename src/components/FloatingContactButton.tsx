'use client';

import { useState } from 'react';
import ContactDrawer from './ContactDrawer';

export default function FloatingContactButton() {
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);

  return (
    <>
      {/* Floating Contact Button - starts 10vh below header, then scrolls with page */}
      <div className="fixed right-4 top-[calc(200px+10vh)] z-[60]">
        <button
          onClick={() => setIsContactDrawerOpen(true)}
          className="w-14 h-14 bg-[#ed1b24] rounded-full hover:scale-110 transition-transform shadow-lg flex items-center justify-center"
          aria-label="Kontakt öffnen"
        >
          <img
            src="/images/Icons/Kontakt weiß.png"
            alt="Kontakt"
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
