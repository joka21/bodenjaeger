import type { Metadata } from "next";
import localFont from "next/font/local";
import { CartProvider } from "@/contexts/CartContext";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import FloatingContactButton from "@/components/FloatingContactButton";
import "./globals.css";

const poppinsRegular = localFont({
  src: "./fonts/Poppins-Regular.woff",
  variable: "--font-poppins-regular",
  weight: "400",
  display: "swap",
});

const poppinsBold = localFont({
  src: "./fonts/Poppins-Bold.woff",
  variable: "--font-poppins-bold",
  weight: "700",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bodenjäger - Premium Bodenbeläge Online",
  description: "Hochwertige Vinyl-, Laminat- und Parkettböden von COREtec, primeCORE und mehr. Fachhandel mit großem Lagerbestand und persönlicher Beratung.",
  keywords: "Bodenbelag, Vinyl, Laminat, Parkett, COREtec, primeCORE, Rigid-Vinyl, Klebe-Vinyl",
  authors: [{ name: "Bodenjäger" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <head>
        {/* Preconnect to WooCommerce backend for faster API calls */}
        <link rel="preconnect" href="https://plan-dein-ding.de" />
        <link rel="dns-prefetch" href="https://plan-dein-ding.de" />

        {/* Preconnect to external image sources */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body
        className={`${poppinsRegular.variable} ${poppinsBold.variable} antialiased`}
      >
        <CartProvider>
          <HeaderWrapper />
          <FloatingContactButton />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
