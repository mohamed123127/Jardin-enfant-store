"use client";

import React, { useState } from "react";
import {
  FiX,
  FiCheckCircle,
  FiTruck,
  FiUser,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiShield,
  FiArrowRight
} from "react-icons/fi";
import { useCart } from "@/context/CartContext";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WILAYAS = [
  "16 - Alger",
  "31 - Oran",
  "25 - Constantine",
  "06 - Béjaïa",
  "19 - Sétif",
  "09 - Blida",
  "35 - Boumerdès",
  "15 - Tizi Ouzou",
  "23 - Annaba",
  "13 - Tlemcen",
  "05 - Batna",
  "14 - Tiaret",
  "22 - Sidi Bel Abbès",
  "28 - M'Sila",
  "42 - Tipaza",
  "Autre wilaya (58 wilayas disponibles)",
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cartItems, cartCount, subtotal, shippingFee, totalPrice, clearCart } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState(WILAYAS[0]);
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState<"home" | "desk">("home");
  const [notes, setNotes] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const handleFinish = () => {
    clearCart();
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800 max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              <FiShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 dark:text-white">
                Finaliser votre commande
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Paiement comptant à la livraison (COD)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <FiCheckCircle className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                Merci pour votre commande ! 🎉
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                Votre commande a été enregistrée avec succès. Notre service client va vous contacter au <span className="font-bold text-orange-500">{phone}</span> pour confirmer la livraison.
              </p>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 max-w-sm mx-auto text-left text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-zinc-900 dark:text-white">
                  <span>Destinataire :</span>
                  <span>{fullName}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Wilaya :</span>
                  <span>{wilaya}</span>
                </div>
                <div className="flex justify-between font-black text-orange-500 pt-1 border-t border-zinc-200 dark:border-zinc-700 text-sm">
                  <span>Total à payer :</span>
                  <span>{totalPrice.toFixed(2)} DA</span>
                </div>
              </div>
              <button
                onClick={handleFinish}
                className="mt-4 px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all cursor-pointer"
              >
                Retourner à la boutique
              </button>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-5">

              {/* Personal Info */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                  <FiUser className="w-4 h-4 text-orange-500" /> Informations Personnelles
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Nom & Prénom *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Mohamed Benali"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Téléphone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: 0550 12 34 56"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                  <FiMapPin className="w-4 h-4 text-orange-500" /> Adresse de Livraison
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Wilaya *
                    </label>
                    <select
                      value={wilaya}
                      onChange={(e) => setWilaya(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      {WILAYAS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Commune
                    </label>
                    <input
                      type="text"
                      value={commune}
                      onChange={(e) => setCommune(e.target.value)}
                      placeholder="Ex: Bab Ezzouar"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Adresse exacte
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rue, Bâtiment, Apparement..."
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  />
                </div>
              </div>

              {/* Delivery Mode */}
              <div className="space-y-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-400 flex items-center gap-1.5">
                  <FiTruck className="w-4 h-4 text-orange-500" /> Mode de Livraison
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("home")}
                    className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${deliveryType === "home"
                        ? "border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 ring-2 ring-orange-500/20"
                        : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-white">Livraison à domicile</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Directement chez vous</div>
                    </div>
                    <span className="font-black text-xs text-orange-500">
                      {subtotal >= 15000 ? "Gratuit" : "600 DA"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType("desk")}
                    className={`p-3.5 rounded-2xl border text-left flex items-start justify-between transition-all ${deliveryType === "desk"
                        ? "border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 ring-2 ring-orange-500/20"
                        : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
                      }`}
                  >
                    <div>
                      <div className="font-bold text-xs text-zinc-900 dark:text-white">Point Relais (Stop Desk)</div>
                      <div className="text-[11px] text-zinc-500 mt-0.5">Retrait au bureau Yalidine</div>
                    </div>
                    <span className="font-black text-xs text-orange-500">
                      {subtotal >= 15000 ? "Gratuit" : "400 DA"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/70 dark:border-zinc-700/60 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Articles ({cartCount}) :</span>
                  <span className="font-bold">{subtotal.toFixed(2)} DA</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-300">
                  <span>Frais de livraison :</span>
                  <span className="font-bold">
                    {shippingFee === 0 ? <span className="text-emerald-600">Gratuit</span> : `${shippingFee.toFixed(2)} DA`}
                  </span>
                </div>
                <div className="flex justify-between font-black text-base text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span>Total à payer à la livraison :</span>
                  <span className="text-orange-500">{totalPrice.toFixed(2)} DA</span>
                </div>
              </div>

            </form>
          )}
        </div>

        {/* Footer Actions */}
        {!isSubmitted && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 font-bold text-xs text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Traitement en cours...</span>
              ) : (
                <>
                  <span>Confirmer la commande ({totalPrice.toFixed(2)} DA)</span>
                  <FiArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
