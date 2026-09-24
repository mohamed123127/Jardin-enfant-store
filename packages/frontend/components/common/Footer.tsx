"use client";

import React from "react";
import Link from "next/link";
import {
  FiPhone,
  FiInstagram,
  FiFacebook,
  FiHeart,
  FiSmile,
} from "react-icons/fi";
import { useTranslations } from "next-intl";

const Footer = () => {
  const t = useTranslations("footer");

  return (
    <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 mt-1 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-400 to-rose-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <FiSmile className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold text-zinc-900 dark:text-white">
            Jardin d&apos;Enfants
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 text-center">
          © {new Date().getFullYear()} {t("copyright")}
        </p>

        {/* Social Links */}
        <div className="flex gap-2">
          <a
            href="#"
            aria-label={t("facebookAriaLabel")}
            className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <FiFacebook className="w-3.5 h-3.5" />
          </a>
          <a
            href="#"
            aria-label={t("instagramAriaLabel")}
            className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-amber-500 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <FiInstagram className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://wa.me/213775248815"
            aria-label={t("whatsappAriaLabel")}
            className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <FiPhone className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;