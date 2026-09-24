"use client";

import React from "react";
import { FiX, FiInfo } from "react-icons/fi";
import { useTranslations } from "next-intl";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslations("sizeGuide");

  if (!isOpen) return null;

  const SIZES = [
    { age: "1 - 2 ans", top: "40 cm", sleeves: "31 cm", pants: "50 cm", stature: "80 - 86 cm", weight: "10 - 12 kg" },
    { age: "2 - 3 ans", top: "42 cm", sleeves: "33 cm", pants: "54 cm", stature: "86 - 94 cm", weight: "12 - 14 kg" },
    { age: "3 - 4 ans", top: "45 cm", sleeves: "36 cm", pants: "59 cm", stature: "94 - 102 cm", weight: "14 - 16 kg" },
    { age: "4 - 5 ans", top: "48 cm", sleeves: "39 cm", pants: "64 cm", stature: "102 - 108 cm", weight: "16 - 18 kg" },
    { age: "5 - 6 ans", top: "51 cm", sleeves: "42 cm", pants: "69 cm", stature: "108 - 116 cm", weight: "18 - 21 kg" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Box */}
      <div className="relative bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-zinc-100 dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <span className="text-lg">📏</span>
          </div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white">
            {t("title")}
          </h3>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
          {t("subtitle")}
        </p>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800 mb-6">
          <table className="w-full text-left text-xs text-zinc-700 dark:text-zinc-300">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 uppercase font-bold text-[11px] border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-3.5 py-3">{t("size")}</th>
                <th className="px-3.5 py-3">{t("topLength")}</th>
                <th className="px-3.5 py-3">{t("sleevesLength")}</th>
                <th className="px-3.5 py-3">{t("pantsLength")}</th>
                <th className="px-3.5 py-3">{t("height")}</th>
                <th className="px-3.5 py-3">{t("weight")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 font-medium">
              {SIZES.map((row, idx) => (
                <tr
                  key={row.age}
                  className={idx % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-zinc-50/50 dark:bg-zinc-800/30"}
                >
                  <td className="px-3.5 py-3 font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    {row.age}
                  </td>
                  <td className="px-3.5 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap">{row.top}</td>
                  <td className="px-3.5 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap">{row.sleeves}</td>
                  <td className="px-3.5 py-3 font-bold text-zinc-900 dark:text-white whitespace-nowrap">{row.pants}</td>
                  <td className="px-3.5 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{row.stature}</td>
                  <td className="px-3.5 py-3 text-zinc-500 dark:text-zinc-400 whitespace-nowrap">{row.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Advice Box */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
          <FiInfo className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            {t("advice")}
          </div>
        </div>
      </div>
    </div>
  );
};
