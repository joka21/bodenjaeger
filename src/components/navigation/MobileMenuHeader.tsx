import Image from 'next/image';

interface MobileMenuHeaderProps {
  currentLevel: 1 | 2 | 3;
  onClose: () => void;
  onBack?: () => void;
}

export default function MobileMenuHeader({ currentLevel, onClose, onBack }: MobileMenuHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 h-[60px] bg-[#2e2d32] flex-shrink-0">
      {/* Left: Back Button (only on level 2 and 3) */}
      <div className="w-8">
        {currentLevel > 1 && onBack && (
          <button
            onClick={onBack}
            className="text-white hover:opacity-80 transition-opacity"
            aria-label="Zurück zur vorherigen Ebene"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Center: Logo */}
      <div className="flex-shrink-0">
        <img
          src="/images/logo/logo-bodenjaeger-fff.svg"
          alt="Bodenjäger"
          className="h-12"
        />
      </div>

      {/* Right: Close Button */}
      <button
        onClick={onClose}
        className="text-white hover:opacity-80 transition-opacity w-8 flex items-center justify-center"
        aria-label="Menü schließen"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
