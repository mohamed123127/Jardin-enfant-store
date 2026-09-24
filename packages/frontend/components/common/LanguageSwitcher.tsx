"use client";

import React, { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/lib/locale";
import { useRouter } from "next/navigation";

type Locale = "fr" | "ar";

export const LanguageSwitcher: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations("header");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const next: Locale = locale === "fr" ? "ar" : "fr";
    startTransition(async () => {
      await setUserLocale(next);
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      aria-label="Changer de langue / تغيير اللغة"
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-xl
        text-xs font-bold border
        border-zinc-200 dark:border-zinc-700
        bg-white dark:bg-zinc-800
        text-zinc-700 dark:text-zinc-200
        hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400
        transition-all duration-200
        ${isPending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span className="text-sm leading-none">{locale === "fr" ? "🇩🇿" : "🇫🇷"}</span>
      <span>{t("languageSwitcher")}</span>
    </button>
  );
};

export default LanguageSwitcher;
