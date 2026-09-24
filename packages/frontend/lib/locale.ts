"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "NEXT_LOCALE";
const DEFAULT_LOCALE = "fr";
const SUPPORTED_LOCALES = ["fr", "ar"] as const;

export async function getUserLocale(): Promise<string> {
  const cookieStore = await cookies();
  const val = cookieStore.get(COOKIE_NAME)?.value;
  if (val && (SUPPORTED_LOCALES as readonly string[]).includes(val)) {
    return val;
  }
  return DEFAULT_LOCALE;
}

export async function setUserLocale(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
  });
}
