"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiCheckCircle,
  FiPhoneCall,
  FiShoppingBag,
  FiTruck,
  FiMapPin,
  FiArrowRight,
  FiHome,
  FiShield,
  FiInbox
} from "react-icons/fi";

import { useTranslations } from "next-intl";

interface OrderDetails {
  orderId: string;
  date: string;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    wilaya: string;
    commune?: string;
    address?: string;
    agencyName?: string;
    agencyAddress?: string;
    deliveryType: "home" | "desk";
    notes?: string;
  };
  items: Array<{
    name: string;
    color: string;
    size: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
}

export const OrderSuccessView: React.FC = () => {
  const t = useTranslations("orderSuccess");
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("last_completed_order");
      if (stored) {
        setOrder(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse completed order details:", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans pb-16 selection:bg-orange-500 selection:text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Main Success Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-xl overflow-hidden p-6 sm:p-10 text-center space-y-8 animate-in zoom-in-95 duration-300">

          {/* Badge & Icon */}
          <div className="space-y-4">
            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
              <FiCheckCircle className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
              <span>{t("badge")}</span>
              {order?.orderId && <span>#{order.orderId}</span>}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
              {t("title")}
            </h1>
          </div>

          {/* Highlight Call Notice Banner */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-orange-500/30 max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 font-extrabold text-base sm:text-lg">
              <FiPhoneCall className="w-6 h-6 animate-bounce" />
              <span>{t("callNotice")}</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {t("callNoticeDesc", { phone: order?.customer.phone || t("yourPhone") })}
            </p>
          </div>

          {/* Order Details Grid */}
          {order && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left rtl:text-right pt-4 border-t border-zinc-100 dark:border-zinc-800">

              {/* Customer & Shipping Summary */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-3 text-xs">
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                  <FiMapPin className="w-4 h-4 text-orange-500" /> {t("deliveryInfo")}
                </h3>
                <div className="space-y-1.5 text-zinc-600 dark:text-zinc-300 font-medium">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{t("client")}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{order.customer.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{t("phone")}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{order.customer.phone}</span>
                  </div>
                  {order.customer.email && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t("email")}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{order.customer.email}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{t("wilaya")}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{order.customer.wilaya}</span>
                  </div>
                  {order.customer.commune && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">{t("commune")}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{order.customer.commune}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-zinc-400">{t("mode")}</span>
                    <span className="font-bold text-orange-500">
                      {order.customer.deliveryType === "home" ? t("homeDelivery") : t("stopDesk")}
                    </span>
                  </div>

                  {order.customer.deliveryType === "home" && order.customer.address && (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      <span className="text-zinc-400 block mb-0.5">{t("deliveryAddress")}</span>
                      <span className="font-bold text-zinc-900 dark:text-white">{order.customer.address}</span>
                    </div>
                  )}

                  {order.customer.deliveryType === "desk" && order.customer.agencyName && (
                    <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 space-y-1">
                      <span className="text-zinc-400 block">{t("agencyOffice")}</span>
                      <span className="font-bold text-zinc-900 dark:text-white block">{order.customer.agencyName}</span>
                      {order.customer.agencyAddress && (
                        <span className="text-[11px] text-zinc-500 block">{order.customer.agencyAddress}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Items & Payment Summary */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-3 text-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2 mb-3">
                    <FiShoppingBag className="w-4 h-4 text-orange-500" /> {t("orderSummary")} ({order.items.length})
                  </h3>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-zinc-600 dark:text-zinc-300 font-medium text-[11px]">
                        <span className="truncate max-w-[180px]">
                          {it.quantity}x {it.name} ({it.color}, {it.size})
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {(it.price * it.quantity).toLocaleString("fr-DZ")} DA
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 space-y-1">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                    <span>{t("subtotal")}</span>
                    <span className="font-bold">{order.subtotal.toLocaleString("fr-DZ")} DA</span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>{t("shipping")}</span>
                    {order.shippingFee === 0 ? (
                      <span className="font-bold text-emerald-500">{t("freeShipping")}</span>
                    ) : (
                      <span className="font-bold">{order.shippingFee.toLocaleString("fr-DZ")} DA</span>
                    )}
                  </div>
                  <div className="flex justify-between font-black text-sm text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-700">
                    <span>{t("total")}</span>
                    <span className="text-orange-500 text-base">{order.totalPrice.toLocaleString("fr-DZ")} DA</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/store"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <FiHome className="w-4 h-4" />
              <span>{t("continueShopping")}</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};
