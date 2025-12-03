'use client';

export default function TrustBadges() {
  return (
    <div className="flex flex-row justify-center gap-12 py-6 border-b border-[#e5e5e5] bg-white">
      {/* Badge 1 */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center text-[#2e2d32]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <span className="text-xs text-center text-[#2e2d32] leading-tight">
          Trusted Shops<br/>Käuferschutz
        </span>
      </div>

      {/* Badge 2 */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center text-[#2e2d32]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xs text-center text-[#2e2d32] leading-tight">
          100 Tage<br/>Rückgaberecht
        </span>
      </div>

      {/* Badge 3 */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center text-[#2e2d32]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
        <span className="text-xs text-center text-[#2e2d32] leading-tight">
          Lieferung zum<br/>Wunschzeitraum
        </span>
      </div>
    </div>
  );
}
