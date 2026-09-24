"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSend,
  FiCheck,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiChevronRight,
  FiInstagram,
  FiFacebook,
} from "react-icons/fi";

// ─── EmailJS Config ──────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID = "service_m902cbx";
const EMAILJS_TEMPLATE_ID = "template_umc0v38"; // reuse existing or create contact template
const EMAILJS_PUBLIC_KEY = "A1JMLTnXZN_GblJm_";

// ─── Contact Info ─────────────────────────────────────────────────────────────
const CONTACT_INFO = [
  {
    icon: FiPhone,
    label: "Téléphone / WhatsApp",
    value: "0775 24 88 15",
    href: "tel:0775248815",
    color: "text-emerald-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: FiMail,
    label: "Email",
    value: "contact@jardindenfants.dz",
    href: "mailto:contact@jardindenfants.dz",
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
  {
    icon: FiMapPin,
    label: "Adresse",
    value: "Alger, Algérie",
    href: "#",
    color: "text-rose-500",
    bg: "bg-rose-50 dark:bg-rose-950/30",
  },
  {
    icon: FiClock,
    label: "Disponibilité",
    value: "Lun – Sam : 8h00 – 20h00",
    href: "#",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
];

const FAQ = [
  {
    q: "Combien de temps prend la livraison ?",
    a: "La livraison prend généralement 2 à 5 jours ouvrables selon votre wilaya.",
  },
  {
    q: "Puis-je echanger un article ?",
    a: "Oui, l''échange est possible dans les 7 jours suivant la réception, sous conditions.",
  },
  {
    q: "Livrez-vous dans toutes les wilayas ?",
    a: "Nous livrons dans 58 wilayas à travers toute l''Algérie.",
  },
  {
    q: "Comment puis-je suivre ma commande ?",
    a: "Contactez-nous par téléphone ou WhatsApp avec votre numéro de commande.",
  },
];

// ─── Contact View ─────────────────────────────────────────────────────────────
export default function ContactView() {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Veuillez entrer votre nom.";
    if (!formData.phone.trim() || !/^0[5-7]\d{8}$/.test(formData.phone.replace(/\s/g, "")))
      e.phone = "Numéro invalide (ex: 0550 12 34 56).";
    if (!formData.message.trim()) e.message = "Veuillez saisir votre message.";
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("sending");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_name: "Admin Jardin d''Enfants Store",
          from_name: formData.name,
          phone: formData.phone,
          subject: formData.subject || "Message via formulaire de contact",
          message: `📬 NOUVEAU MESSAGE DE CONTACT\n\n👤 Nom : ${formData.name}\n📞 Téléphone : ${formData.phone}\n📧 Email : ${formData.email || "Non renseigné"}\n\n📋 Sujet : ${formData.subject || "Non précisé"}\n\n💬 Message :\n${formData.message}`,
          customer_name: formData.name,
          customer_phone: formData.phone,
          order_id: "CONTACT",
          wilaya_name: "N/A",
          commune_name: "N/A",
          delivery_type: "N/A",
          agency_name: "N/A",
          agency_address: "N/A",
          exact_address: "N/A",
          total_price: "N/A",
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16">
      {/* ── Page Hero ───────────────────────────────────────────────────── */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-zinc-500 mb-8">
          <Link href="/" className="hover:text-amber-500 transition-colors">Accueil</Link>
          <FiChevronRight className="w-3 h-3" />
          <span className="text-zinc-900 dark:text-white font-semibold">Contact</span>
        </nav>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-4">
            <FiMessageSquare className="w-4 h-4" />
            Nous sommes là pour vous
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white mb-4">
            Contactez-nous 👋
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto text-base sm:text-lg leading-relaxed">
            Une question, une réclamation ou simplement envie de nous dire bonjour ?
            Nous vous répondons dans les plus brefs délais.
          </p>
        </div>

        {/* ── Main Grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left: Info Cards ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">
            {CONTACT_INFO.map((info, i) => {
              const Icon = info.icon;
              return (
                <a
                  key={i}
                  href={info.href}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${info.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      {info.label}
                    </div>
                    <div className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5">
                      {info.value}
                    </div>
                  </div>
                </a>
              );
            })}

            {/* Social Links */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shadow-amber-500/20">
              <p className="text-white font-bold text-sm mb-3">Suivez-nous sur les réseaux</p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
                >
                  <FiFacebook className="w-4 h-4" />
                  Facebook
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
                >
                  <FiInstagram className="w-4 h-4" />
                  Instagram
                </a>
              </div>
            </div>
          </div>

          {/* ── Right: Contact Form ───────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-8">
              <h2 className="text-xl font-black text-zinc-900 dark:text-white mb-6">
                Envoyer un message ✉️
              </h2>

              {status === "success" ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
                    <FiCheck className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">
                    Message envoyé ! 🎉
                  </h3>
                  <p className="text-zinc-500 text-sm mb-8 max-w-sm">
                    Merci de nous avoir contactés. Nous vous répondrons dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Nom & Prénom *
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Mohamed Benali"
                          className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all focus:ring-2 ${
                            errors.name
                              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                              : "border-zinc-200 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20"
                          }`}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                        Téléphone *
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="0550 12 34 56"
                          className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all focus:ring-2 ${
                            errors.phone
                              ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                              : "border-zinc-200 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                          <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Email <span className="text-zinc-400 font-normal">(Optionnel)</span>
                    </label>
                    <div className="relative">
                      <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Sujet
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="">Choisir un sujet…</option>
                      <option value="Demande d''information">Demande d&apos;information</option>
                      <option value="Problème de commande">Problème de commande</option>
                      <option value="Échange / Retour">Échange / Retour</option>
                      <option value="Problème de livraison">Problème de livraison</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Décrivez votre demande ici…"
                      className={`w-full px-4 py-3.5 rounded-2xl border bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold text-zinc-900 dark:text-white outline-none transition-all focus:ring-2 resize-none ${
                        errors.message
                          ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                          : "border-zinc-200 dark:border-zinc-700 focus:border-amber-500 focus:ring-amber-500/20"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Error banner */}
                  {status === "error" && (
                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 text-sm font-semibold">
                      <FiAlertCircle className="w-5 h-5 shrink-0" />
                      Une erreur s&apos;est produite. Veuillez réessayer ou nous appeler directement.
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <FiSend className="w-4 h-4" />
                        Envoyer le message
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-zinc-400">
                    📧 Votre message sera envoyé directement à notre équipe par email.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ─────────────────────────────────────────────────── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white mb-2">
            Questions fréquentes 💬
          </h2>
          <p className="text-zinc-500 text-sm">Trouvez rapidement la réponse à votre question.</p>
        </div>

        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60 transition-colors"
              >
                <span className="text-sm font-bold text-zinc-900 dark:text-white pr-4">
                  {item.q}
                </span>
                <span
                  className={`shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center text-xs font-black transition-transform duration-200 ${
                    openFaq === i ? "rotate-90" : ""
                  }`}
                >
                  ›
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
