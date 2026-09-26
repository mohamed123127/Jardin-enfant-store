"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FiShoppingCart,
  FiPhone,
  FiTruck,
  FiMenu,
  FiX,
  FiGrid,
  FiPlusCircle,
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import logo from "@/public/images/logo.png";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface StoreHeaderProps {
  wishlistCount?: number;
}

export const Header: React.FC<StoreHeaderProps> = ({ wishlistCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const t = useTranslations("header");
  const tNav = useTranslations("nav");

  const NAV_LINKS = [
    { name: tNav("boutique"), href: "/store", icon: FiGrid },
    // { name: "Ajouter Produit", href: "/addProduct", icon: FiPlusCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800 shadow-sm transition-colors duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-xs py-2 px-4 text-center font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <FiTruck className="w-3.5 h-3.5" /> {t("announcement")}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-[11px]">
            <FiPhone className="w-3 h-3" /> {t("phone")}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 relative flex items-center justify-between">

        {/* Mobile: Burger Button (Left) */}
        <div className="flex md:hidden items-center z-10">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t("closeMenu") : t("openMenu")}
            className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 flex items-center justify-center transition-colors"
          >
            {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Logo / Brand (Desktop: Left | Mobile: Centered) */}
        <div className="md:static absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 z-10 flex items-center">
          <Link href="/store" className="flex items-center gap-2.5 shrink-0 group">
            <Image
              src={logo}
              alt="Logo"
              height={46}
              className="w-auto h-auto"
              priority
            />
          </Link>
        </div>

        {/* Desktop: Navigation Links (Centered) */}
        <nav className="hidden md:flex items-center justify-center gap-1 lg:gap-2 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-3.5 py-2 rounded-xl text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80 transition-all duration-150 flex items-center gap-1.5"
            >
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 z-10">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Cart Button — links to cart page */}
          <Link
            href="/cart"
            aria-label={t("cart")}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-98 transition-all"
          >
            <div className="relative">
              <FiShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">{t("cart")} ({cartCount})</span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu Sidebar / Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Nav Links */}
          <div className="space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{link.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile: Cart Link */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-amber-50 dark:hover:bg-zinc-800 hover:text-amber-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                  <FiShoppingCart className="w-4 h-4" />
                </div>
                <span>{t("mobileCart")}</span>
              </div>
              {cartCount > 0 && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Language Switcher */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 px-2">
            <LanguageSwitcher />
          </div>

          {/* Contact */}
          <div className="pt-2 text-xs text-zinc-500 flex items-center justify-between px-2">
            <span>{t("mobileContact")}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t("support")}</span>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
