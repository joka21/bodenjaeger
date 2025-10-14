import type { Metadata } from "next";
import localFont from "next/font/local";
import dynamic from "next/dynamic";
import { CartProvider } from "@/contexts/CartContext";
import Footer from "@/components/Footer";
import "./globals.css";

const Header = dynamic(() => import("@/components/Header"), { ssr: true });

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
  title: "WooCommerce Store",
  description: "Headless WooCommerce Shop built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${poppinsRegular.variable} ${poppinsBold.variable} antialiased`}
      >
        <CartProvider>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
