"use client";

import { useState } from "react";
import { FALLBACK_IMAGE } from "@/lib/constants";

export function SmartImage({ src, alt = "", className }) {
  const [failed, setFailed] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={failed || !src ? FALLBACK_IMAGE : src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />
  );
}
