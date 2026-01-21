'use client';

export default function ExpressCheckout() {
  return (
    <div className="mb-6">
      <p className="text-center text-sm text-[#4c4c4c] mb-4">Express Checkout</p>

      <div className="flex flex-row gap-3">
        {/* PayPal Button */}
        <button className="flex-1 h-12 bg-[#ffc439] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
          <span className="font-bold text-[#003087]">PayPal</span>
        </button>

        {/* Google Pay Button */}
        <button className="flex-1 h-12 bg-[#000000] rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity">
          <span className="font-bold text-white">Google Pay</span>
        </button>
      </div>

      {/* Trennlinie */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[#e5e5e5]"></div>
        <span className="text-sm text-[#4c4c4c]">ODER</span>
        <div className="flex-1 h-px bg-[#e5e5e5]"></div>
      </div>
    </div>
  );
}
