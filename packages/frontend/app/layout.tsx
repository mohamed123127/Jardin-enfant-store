import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { CartProvider } from "@/context/CartContext";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jardin d'Enfants — Boutique",
  description: "Découvrez notre collection d'équipements, jouets et vêtements pour enfants.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getLocale();
  const messages = await getMessages();
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <ReactQueryProvider>
              <Header />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
            </ReactQueryProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

