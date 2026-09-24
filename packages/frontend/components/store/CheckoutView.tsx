"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiTruck,
  FiUser,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiShield,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiFileText,
  FiMail,
  FiAlertCircle,
  FiHome,
  FiInbox
} from "react-icons/fi";
import emailjs from "@emailjs/browser";
import { useCart } from "@/context/CartContext";
import { apiClient } from "@/api/client";
import { useTranslations } from "next-intl";
import {
  WILAYAS,
  getCommunesForWilaya,
  getAgencesForWilayaOrCommune,
  Wilaya,
  Commune,
  Agence,
} from "@/data/shippingData";

interface FormData {
  fullName: string;
  phone: string;
  // email: string;
  wilayaId: number;
  communeId: number;
  deliveryType: "home" | "desk";
  address: string;
  agencyId: number | "";
  notes: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  // email?: string;
  wilayaId?: string;
  communeId?: string;
  address?: string;
  agencyId?: string;
}

function validateCheckoutForm(data: FormData, t: any): FormErrors {
  const errors: FormErrors = {};

  if (!data.fullName.trim()) {
    errors.fullName = t("errors.fullNameRequired");
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = t("errors.fullNameMin");
  }

  const cleanPhone = data.phone.replace(/\s+/g, "");
  if (!cleanPhone) {
    errors.phone = t("errors.phoneRequired");
  } else if (!/^(05|06|07|02|03|04)\d{8}$/.test(cleanPhone)) {
    errors.phone = t("errors.phoneInvalid");
  }

  if (!data.wilayaId) {
    errors.wilayaId = t("errors.wilayaRequired");
  }

  if (!data.communeId) {
    errors.communeId = t("errors.communeRequired");
  }

  if (data.deliveryType === "home") {
    if (!data.address.trim()) {
      errors.address = t("errors.addressRequired");
    } else if (data.address.trim().length < 5) {
      errors.address = t("errors.addressMin");
    }
  } else if (data.deliveryType === "desk") {
    if (!data.agencyId) {
      errors.agencyId = t("errors.agencyRequired");
    }
  }

  return errors;
}

export const CheckoutView: React.FC = () => {
  const t = useTranslations("checkout");
  const router = useRouter();
  const { cartItems, cartCount, subtotal, clearCart } = useCart();

  // Initial Wilaya: Alger (16) if available, otherwise first wilaya
  const defaultWilaya = useMemo(() => {
    const alger = WILAYAS.find((w) => w.id === 16);
    return alger || WILAYAS[0];
  }, []);

  const defaultCommunes = useMemo(
    () => getCommunesForWilaya(defaultWilaya.id),
    [defaultWilaya]
  );
  const defaultAgences = useMemo(
    () => getAgencesForWilayaOrCommune(defaultWilaya.id, defaultCommunes[0]?.id),
    [defaultWilaya, defaultCommunes]
  );

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    // email: "",
    wilayaId: defaultWilaya.id,
    communeId: defaultCommunes[0]?.id || 0,
    deliveryType: "home",
    address: "",
    agencyId: defaultAgences[0]?.id || "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Selected Wilaya object
  const selectedWilaya = useMemo(
    () => WILAYAS.find((w) => w.id === Number(formData.wilayaId)) || defaultWilaya,
    [formData.wilayaId, defaultWilaya]
  );

  // Filtered Communes for selected Wilaya
  const availableCommunes = useMemo(
    () => getCommunesForWilaya(selectedWilaya.id),
    [selectedWilaya.id]
  );

  // Selected Commune object
  const selectedCommune = useMemo(
    () => availableCommunes.find((c) => c.id === Number(formData.communeId)) || availableCommunes[0],
    [availableCommunes, formData.communeId]
  );

  // Filtered Agences for selected Wilaya & Commune
  const availableAgences = useMemo(
    () => getAgencesForWilayaOrCommune(selectedWilaya.id, selectedCommune?.id),
    [selectedWilaya.id, selectedCommune?.id]
  );

  // Selected Agence object
  const selectedAgency = useMemo(
    () => availableAgences.find((a) => a.id === Number(formData.agencyId)) || availableAgences[0],
    [availableAgences, formData.agencyId]
  );

  // Calculate delivery price dynamically from wilaya JSON
  const shippingFee = useMemo(() => {
    if (subtotal >= 15000) return 0;
    return formData.deliveryType === "home"
      ? selectedWilaya.homeTarif
      : selectedWilaya.stopDeskTarif;
  }, [subtotal, formData.deliveryType, selectedWilaya]);

  const totalPrice = subtotal + shippingFee;

  // Handle Wilaya change: auto-update commune & agence
  const handleWilayaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWilayaId = Number(e.target.value);
    const communes = getCommunesForWilaya(newWilayaId);
    const newCommuneId = communes[0]?.id || 0;
    const agences = getAgencesForWilayaOrCommune(newWilayaId, newCommuneId);

    const updatedData: FormData = {
      ...formData,
      wilayaId: newWilayaId,
      communeId: newCommuneId,
      agencyId: agences[0]?.id || "",
    };

    setFormData(updatedData);

    if (touched.wilayaId || touched.communeId || touched.agencyId) {
      setErrors(validateCheckoutForm(updatedData, t));
    }
  };

  // Handle Commune change: auto-update agence if Stop Desk
  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCommuneId = Number(e.target.value);
    const agences = getAgencesForWilayaOrCommune(formData.wilayaId, newCommuneId);

    const updatedData: FormData = {
      ...formData,
      communeId: newCommuneId,
      agencyId: agences[0]?.id || "",
    };

    setFormData(updatedData);

    if (touched.communeId || touched.agencyId) {
      setErrors(validateCheckoutForm(updatedData, t));
    }
  };

  // Generic Field Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      setErrors(validateCheckoutForm(updated, t));
    }
  };

  // Field Blur handler (validation pattern matching ContactForm.tsx)
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validateCheckoutForm(formData, t));
  };

  // Decrease stock for variants in backend
  const decreaseVariantStock = async (item: any) => {
    try {
      if (!item.product?.variants || !Array.isArray(item.product.variants)) return;

      const variant = item.product.variants.find((v: any) => {
        const specs = v.specifications || [];
        const cVal = specs.find((s: any) =>
          ["color", "couleur"].includes(s.attribute?.name?.toLowerCase() || s.attribute?.toLowerCase())
        )?.value;
        const sVal = specs.find((s: any) =>
          ["size", "taille"].includes(s.attribute?.name?.toLowerCase() || s.attribute?.toLowerCase())
        )?.value;

        const matchesColor = !cVal || cVal.trim().toLowerCase() === item.selectedColor.trim().toLowerCase();
        const matchesSize = !sVal || sVal.trim().toLowerCase() === item.selectedSize.trim().toLowerCase();
        return matchesColor && matchesSize;
      });

      const variantId = variant?.id || (item.product.variants[0]?.id ? item.product.variants[0].id : null);

      if (variantId) {
        await apiClient.patch(`/ProductVariants/${variantId}/decrease-quantity`, {
          quantityToDecrease: item.quantity,
        });
      }
    } catch (err) {
      console.error(`Failed to decrease stock for variant of ${item.product?.name}:`, err);
    }
  };

  // Handle Submit Order
  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      fullName: true,
      phone: true,
      // email: true,
      wilayaId: true,
      communeId: true,
      deliveryType: true,
      address: true,
      agencyId: true,
    });

    const formValidationErrors = validateCheckoutForm(formData, t);
    setErrors(formValidationErrors);

    if (Object.keys(formValidationErrors).length > 0) {
      // Scroll to first invalid field if error exists
      const firstErrorKey = Object.keys(formValidationErrors)[0];
      const el = document.getElementById(`field-${firstErrorKey}`);
      if (el) el.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderDate = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 1. Decrease variant stock in backend
    try {
      await Promise.all(cartItems.map((item) => decreaseVariantStock(item)));
    } catch (err) {
      console.error("Error updating variant stock:", err);
    }

    // 2. Format complete order email message
    const formattedItems = cartItems
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.product.name} | Couleur: ${it.selectedColor} | Taille: ${it.selectedSize} | Qté: ${it.quantity} | Prix: ${(it.unitPrice * it.quantity).toLocaleString("fr-DZ")} DA`
      )
      .join("\n");

    const emailContent = `
========================================
   NOUVELLE COMMANDE #${orderId}
========================================

👤 CLIENT :
• Nom & Prénom : ${formData.fullName}
• Numéro Téléphone : ${formData.phone}

📍 ADRESSE ET LIVRAISON :
• Wilaya : ${selectedWilaya.id} - ${selectedWilaya.name}
• Commune : ${selectedCommune?.name || "N/A"}
• Mode de livraison : ${formData.deliveryType === "home" ? "Livraison à Domicile" : "Point Relais (Stop Desk)"}
${formData.deliveryType === "home"
        ? `• Adresse exacte : ${formData.address}`
        : `• Agence Stop Desk : ${selectedAgency?.name || "Non précisée"}\n• Adresse Agence : ${selectedAgency?.address || "N/A"}`
      }
${formData.notes ? `• Remarques Client : ${formData.notes}` : ""}

📦 ARTICLES COMMANDÉS (${cartCount}) :
${formattedItems}

💰 RÉCAPITULATIF FINANCIER :
• Sous-total Articles : ${subtotal.toLocaleString("fr-DZ")} DA
• Tarif Livraison : ${shippingFee === 0 ? "GRATUIT 🎉" : `${shippingFee.toLocaleString("fr-DZ")} DA`}
• TOTAL À ENCAISSER À LA LIVRAISON : ${totalPrice.toLocaleString("fr-DZ")} DA

Date de la commande : ${orderDate}
`;

    // 3. Send Email via EmailJS
    try {
      await emailjs.send(
        "service_m902cbx",
        "template_umc0v38",
        {
          to_name: "Admin Jardin d'Enfants Store",
          from_name: formData.fullName,
          // from_email: formData.email || "client@jardindenfants.dz",
          phone: formData.phone,
          subject: `Nouvelle Commande #${orderId} - ${formData.fullName} (${selectedWilaya.name})`,
          message: emailContent,
          order_id: orderId,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          wilaya_name: selectedWilaya.name,
          commune_name: selectedCommune?.name || "",
          delivery_type: formData.deliveryType === "home" ? "Domicile" : "Stop Desk",
          agency_name: selectedAgency?.name || "N/A",
          agency_address: selectedAgency?.address || "N/A",
          exact_address: formData.address || "N/A",
          total_price: `${totalPrice.toLocaleString("fr-DZ")} DA`,
        },
        "A1JMLTnXZN_GblJm_"
      );
    } catch (emailErr) {
      console.error("EmailJS sending error:", emailErr);
    }

    // 4. Save order summary to sessionStorage
    const orderSummary = {
      orderId,
      date: orderDate,
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        // email: formData.email,
        wilaya: `${selectedWilaya.id} - ${selectedWilaya.name}`,
        commune: selectedCommune?.name,
        address: formData.address,
        agencyName: selectedAgency?.name,
        agencyAddress: selectedAgency?.address,
        deliveryType: formData.deliveryType,
        notes: formData.notes,
      },
      items: cartItems.map((item) => ({
        name: item.product.name,
        color: item.selectedColor,
        size: item.selectedSize,
        quantity: item.quantity,
        price: item.unitPrice,
        image: item.product.previewImage,
      })),
      subtotal,
      shippingFee,
      totalPrice,
    };

    try {
      sessionStorage.setItem("last_completed_order", JSON.stringify(orderSummary));
    } catch (err) {
      console.error("Failed to save order in sessionStorage", err);
    }

    clearCart();
    setIsSubmitting(false);
    router.push("/checkout/success");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans py-12 px-4">
        <div className="max-w-md mx-auto text-center bg-white dark:bg-zinc-900 rounded-3xl p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center mx-auto text-2xl font-bold">
            🛒
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t("emptyCartTitle")}</h2>
          <p className="text-xs text-zinc-500">
            {t("emptyCartSub")}
          </p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            <FiArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t("discoverStore")}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans pb-16 selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-zinc-400 dark:text-zinc-500 mb-6">
          <Link href="/store" className="hover:text-orange-500 transition-colors">{t("breadcrumbHome")}</Link>
          <span>/</span>
          <Link href="/cart" className="hover:text-orange-500 transition-colors">{t("breadcrumbCart")}</Link>
          <span>/</span>
          <span className="text-zinc-900 dark:text-white font-bold">{t("breadcrumbCheckout")}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Main Form + Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Form Side (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-6">
            <form id="checkout-form" onSubmit={handleConfirmOrder} noValidate className="space-y-6">

              {/* SECTION 1: Personal Info */}
              <div className="space-y-4">
                <h2 className="text-sm font-bold tracking-wider uppercase text-orange-500 flex items-center gap-2">
                  <FiUser className="w-4 h-4" /> {t("clientInfo")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nom & Prénom */}
                  <div>
                    <label htmlFor="field-fullName" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t("fullName")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="field-fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("fullNamePlaceholder")}
                      className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all duration-200 focus:ring-2 ${errors.fullName
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 dark:border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
                        }`}
                    />
                    {errors.fullName && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Numéro de téléphone */}
                  <div>
                    <label htmlFor="field-phone" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t("phone")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="field-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("phonePlaceholder")}
                      className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all duration-200 focus:ring-2 ${errors.phone
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 dark:border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
                        }`}
                    />
                    {errors.phone && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 2: Wilaya & Commune Selection */}
              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h2 className="text-sm font-bold tracking-wider uppercase text-orange-500 flex items-center gap-2">
                  <FiMapPin className="w-4 h-4" /> {t("location")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Wilaya Select */}
                  <div>
                    <label htmlFor="field-wilayaId" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t("wilaya")} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="field-wilayaId"
                      name="wilayaId"
                      value={formData.wilayaId}
                      onChange={handleWilayaChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all duration-200 focus:ring-2 ${errors.wilayaId
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 dark:border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
                        }`}
                    >
                      {WILAYAS.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.id} - {w.name}
                        </option>
                      ))}
                    </select>
                    {errors.wilayaId && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.wilayaId}
                      </p>
                    )}
                  </div>

                  {/* Commune Select */}
                  <div>
                    <label htmlFor="field-communeId" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t("commune")} <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="field-communeId"
                      name="communeId"
                      value={formData.communeId}
                      onChange={handleCommuneChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all duration-200 focus:ring-2 ${errors.communeId
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 dark:border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
                        }`}
                    >
                      {availableCommunes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    {errors.communeId && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.communeId}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Delivery Mode & Address / Agence Selection */}
              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h2 className="text-sm font-bold tracking-wider uppercase text-orange-500 flex items-center gap-2">
                  <FiTruck className="w-4 h-4" /> {t("deliveryMode")}
                </h2>

                {/* Delivery Mode Choice */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Home Delivery Option */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...formData, deliveryType: "home" as const };
                      setFormData(updated);
                      if (touched.address || touched.agencyId) setErrors(validateCheckoutForm(updated, t));
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${formData.deliveryType === "home"
                      ? "border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 ring-2 ring-orange-500/20"
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300"
                      }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        <FiHome className="w-4 h-4 text-orange-500" /> {t("homeDelivery")}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{t("homeDeliverySub")}</div>
                    </div>
                    <span className="font-black text-sm text-orange-500">
                      {subtotal >= 15000 ? t("free") : `${selectedWilaya.homeTarif.toLocaleString("fr-DZ")} DA`}
                    </span>
                  </button>

                  {/* Stop Desk Option */}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = { ...formData, deliveryType: "desk" as const };
                      setFormData(updated);
                      if (touched.address || touched.agencyId) setErrors(validateCheckoutForm(updated, t));
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition-all cursor-pointer ${formData.deliveryType === "desk"
                      ? "border-orange-500 bg-orange-50/40 dark:bg-orange-950/30 ring-2 ring-orange-500/20"
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-zinc-300"
                      }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                        <FiInbox className="w-4 h-4 text-orange-500" /> {t("stopDesk")}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">{t("stopDeskSub")}</div>
                    </div>
                    <span className="font-black text-sm text-orange-500">
                      {subtotal >= 15000 ? t("free") : `${selectedWilaya.stopDeskTarif.toLocaleString("fr-DZ")} DA`}
                    </span>
                  </button>
                </div>

                {/* Conditional Fields based on Delivery Mode */}
                {formData.deliveryType === "home" ? (
                  /* Exact Home Address */
                  <div>
                    <label htmlFor="field-address" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t("exactAddress")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="field-address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={t("exactAddressPlaceholder")}
                      className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all duration-200 focus:ring-2 ${errors.address
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-zinc-200 dark:border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
                        }`}
                    />
                    {errors.address && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.address}
                      </p>
                    )}
                  </div>
                ) : (
                  /* Stop Desk Agency Selector */
                  <div>
                    <label htmlFor="field-agencyId" className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      {t("chooseAgency")} <span className="text-rose-500">*</span>
                    </label>
                    {availableAgences.length === 0 ? (
                      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                        {t("noAgencyFound", { commune: selectedCommune?.name || "" })}
                      </div>
                    ) : (
                      <select
                        id="field-agencyId"
                        name="agencyId"
                        value={formData.agencyId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3.5 rounded-2xl border bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all duration-200 focus:ring-2 ${errors.agencyId
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : "border-zinc-200 dark:border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20"
                          }`}
                      >
                        {availableAgences.map((ag) => (
                          <option key={ag.id} value={ag.id}>
                            {ag.name} ({ag.address})
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.agencyId && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.agencyId}
                      </p>
                    )}
                    {selectedAgency && (
                      <div className="mt-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300">
                        <span className="font-bold text-zinc-900 dark:text-white">{t("agencyAddress")} </span>
                        {selectedAgency.address}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION 4: Notes (Optional) */}
              <div className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <h2 className="text-sm font-bold tracking-wider uppercase text-zinc-400 flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-orange-500" /> {t("notesTitle")}
                </h2>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  placeholder={t("notesPlaceholder")}
                  className="w-full px-4 py-3 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                />
              </div>

              {/* Status Message */}
              {submitError && (
                <p className="text-xs text-center font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl">
                  {submitError}
                </p>
              )}

              {/* Action Buttons */}
              <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link
                  href="/cart"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <FiArrowLeft className="w-4 h-4 rtl:rotate-180" />
                  <span>{t("backToCart")}</span>
                </Link>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:opacity-95 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg shadow-orange-500/25 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      <span>{t("submitting")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("confirmOrder", { total: totalPrice.toLocaleString("fr-DZ") })}</span>
                      <FiArrowRight className="w-5 h-5 stroke-[2.5] rtl:rotate-180" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Sidebar Summary (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">

            {/* Order Items List */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm space-y-4">
              <h2 className="text-base font-black text-zinc-900 dark:text-white flex items-center justify-between">
                <span>{t("summaryTitle")}</span>
                <span className="text-xs font-bold px-2.5 py-1 bg-orange-50 dark:bg-orange-950/50 text-orange-500 rounded-full">
                  {t("summaryItemsCount", { count: cartCount, plural: cartCount > 1 ? "s" : "" })}
                </span>
              </h2>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-80 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-800">
                      <Image
                        src={item.product.previewImage || "/products/affnane-1.jpg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-zinc-400">
                        {item.selectedColor} | {item.selectedSize}
                      </p>
                      <div className="text-xs font-semibold text-zinc-500">
                        {t("qty")} <span className="font-bold text-zinc-900 dark:text-white">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="text-right font-black text-xs text-orange-500">
                      {(item.unitPrice * item.quantity).toLocaleString("fr-DZ")} DA
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{t("subtotal")}</span>
                  <span className="font-bold text-zinc-900 dark:text-white">
                    {subtotal.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>{t("shipping", { wilaya: selectedWilaya.name })}</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-emerald-500">{t("freeShipping")}</span>
                  ) : (
                    <span className="font-bold text-zinc-900 dark:text-white">
                      {shippingFee.toLocaleString("fr-DZ")} DA
                    </span>
                  )}
                </div>
                <div className="flex justify-between font-black text-base text-zinc-900 dark:text-white pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span>{t("totalToPay")}</span>
                  <span className="text-orange-500 text-lg">
                    {totalPrice.toLocaleString("fr-DZ")} DA
                  </span>
                </div>
              </div>

            </div>

            {/* Guarantee / Security Box */}
            <div className="bg-orange-500/5 dark:bg-orange-950/20 border border-orange-500/20 rounded-3xl p-5 space-y-3">
              <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400 font-bold text-xs">
                <FiShield className="w-5 h-5 shrink-0 text-orange-500" />
                <span>{t("securePayment")}</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                {t("securePaymentSub")}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
