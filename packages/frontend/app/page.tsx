"use client";

import AccueilView from "@/components/store/AccueilView";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/store");
  }, []);
  return "";
}

